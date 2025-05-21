import { WebSocket as WsWebSocket, WebSocketServer } from "ws";
import http from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

// Use Render-provided PORT
const PORT = process.env.PORT || 8080;

const server = http.createServer(); // Create HTTP server
const wss = new WebSocketServer({ server });

interface User {
  ws: WsWebSocket;
  rooms: string[];
  userId: string;
}


const users: User[] = [];
const rooms = new Map<string, Set<User>>();

// Token verification function
function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") return null;
    if (!decoded || !(decoded as JwtPayload).userId) return null;
    return (decoded as JwtPayload).userId!;
  } catch (e) {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  const user: User = { ws, rooms: [], userId };
  users.push(user);

  ws.on("message", async function message(data) {
    let parsedData;
    try {
      parsedData = JSON.parse(data.toString());
    } catch (err) {
      return;
    }

    const { type, roomId } = parsedData;

    if (type === "join-room") {
      if (!roomId) return;

      if (!user.rooms.includes(roomId)) {
        user.rooms.push(roomId);
      }

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      rooms.get(roomId)!.add(user);

    } else if (type === "leave-room") {
      if (!roomId) return;

      user.rooms = user.rooms.filter((r) => r !== roomId);
      rooms.get(roomId)?.delete(user);

      if (rooms.get(roomId)?.size === 0) {
        rooms.delete(roomId);
      }

    } else if (type === "draw") {
      if (!roomId || !rooms.has(roomId)) return;

      const recipients = rooms.get(roomId)!;
      const msg = JSON.stringify({
        type: "draw",
        roomId,
        shape: parsedData.shape,
        data: parsedData.data,
      });

      for (const u of recipients) {
        if (u.ws !== ws && u.ws.readyState === WsWebSocket.OPEN) {
          u.ws.send(msg);
        }
      }
    }
  });

  ws.on("close", () => {
    for (const roomId of user.rooms) {
      const roomUsers = rooms.get(roomId);
      if (roomUsers) {
        roomUsers.delete(user);
        if (roomUsers.size === 0) {
          rooms.delete(roomId);
        }
      }
    }

    const index = users.indexOf(user);
    if (index !== -1) users.splice(index, 1);
  });
});

// Start the HTTP server (Render requires this)
server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`WebSocket server running on ws://0.0.0.0:${PORT}`);
});