"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !WS_URL) {
      console.error("Missing token or WebSocket URL");
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join-room",
          roomId,
        })
      );
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "leave-room",
            roomId,
          })
        );
      }
      ws.close();
    };
  }, [roomId, WS_URL]);

  if (!socket) {
    return (
      <div className="text-center text-purple-700 font-medium">
        Connecting to server...
      </div>
    );
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}
