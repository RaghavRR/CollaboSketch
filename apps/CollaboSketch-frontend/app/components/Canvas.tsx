import { useEffect, useRef, useState } from "react";
import React from "react";
import { TopBar } from "./TopBar";
import {
  Circle,
  Pencil,
  RectangleHorizontalIcon,
  ArrowRight,
  TextCursorInput,
  Slash,
  Eraser,
} from "lucide-react";
import { Game } from "@/Draw/Game";

export type Tool = "circle" | "rect" | "pencil" | "line" | "arrow" | "text" | "eraser";

export function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
  const [, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.setTool(selectedTool);
    }

    // Update cursor style on tool change
    if (canvasRef.current) {
      if (selectedTool === "eraser") {
        // Use custom eraser cursor if you have one, else fallback to crosshair
        canvasRef.current.style.cursor = "url('/eraser-cursor.png'), crosshair";
      } else if (selectedTool === "pencil") {
        canvasRef.current.style.cursor = "crosshair";
      } else if (selectedTool === "rect" || selectedTool === "circle") {
        canvasRef.current.style.cursor = "default";
      } else {
        canvasRef.current.style.cursor = "default";
      }
    }
  }, [selectedTool]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const g = new Game(canvasRef.current, roomId, socket);
    gameRef.current = g;
    g.setTool(selectedTool);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "draw" && message.roomId === roomId) {
        g.drawFromServer(message.shape, message.data);
      }
    };

    return () => {
      g.destroy();
      socket.onmessage = null;
      gameRef.current = null;
    };
  }, [roomId, socket]);

  useEffect(() => {
    function handleResize() {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
      if (canvasRef.current && gameRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        gameRef.current.clearCanvas();
        gameRef.current.redrawAll();
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedTool]);

const icons: { tool: Tool; icon: React.ReactElement; label: string }[] = [
  { tool: "pencil", icon: <Pencil />, label: "Pencil" },
  { tool: "line", icon: <Slash />, label: "Line" },
  { tool: "arrow", icon: <ArrowRight />, label: "Arrow" },
  { tool: "rect", icon: <RectangleHorizontalIcon />, label: "Rectangle" },
  { tool: "circle", icon: <Circle />, label: "Circle" },
  { tool: "text", icon: <TextCursorInput />, label: "Text" },
  { tool: "eraser", icon: <Eraser />, label: "Eraser" },
];


  return (
    <div className="h-screen w-screen bg-zinc-900 overflow-hidden relative">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="block border border-zinc-700 bg-zinc-900"
      />

      <div className="absolute top-0 left-0 w-full z-50">
        <TopBar
          roomName={roomId} // Show roomName on the right side
          icons={icons.map(({ tool, icon, label }) => ({
            icon,
            title: label,
            activated: selectedTool === tool,
            onClick: () => setSelectedTool(tool as Tool),

          }))}
        />
      </div>
    </div>
  );
}
