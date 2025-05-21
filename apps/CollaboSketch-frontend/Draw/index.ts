import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type Shape =
  | {
      type: "react";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | {
      type: "eraser";
      x: number;
      y: number;
      width: number;
      height: number;
    };

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
  const ctx = canvas.getContext("2d");

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  if (!ctx) {
    return;
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type == "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  clearCanvas(existingShapes, canvas, ctx);
  let clicked = false;
  let startX = 0;
  let startY = 0;

  // Function to update cursor based on selected tool
  function updateCursor(selectedTool: string) {
    if (selectedTool === "eraser") {
      canvas.style.cursor = "crosshair"; // simple fallback cursor for eraser
    } else if (selectedTool === "pencil") {
      canvas.style.cursor = "crosshair";
    } else if (selectedTool === "rect" || selectedTool === "circle") {
      canvas.style.cursor = "default";
    } else {
      canvas.style.cursor = "default";
    }
  }

  //@ts-ignore
  updateCursor(window.selectedTool);

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mousemove", (e) => {
    //@ts-ignore
    const selectedTool = window.selectedTool;
    updateCursor(selectedTool);

    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeStyle = "rgba(255, 255, 255)";

      if (selectedTool === "rect") {
        ctx.strokeRect(startX, startY, width, height);
      } else if (selectedTool === "circle") {
        const radius = Math.max(width, height) / 2;
        const centerX = startX + radius;
        const centerY = startY + radius;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      } else if (selectedTool === "eraser") {
        const eraserSize = 30;
        ctx.clearRect(e.clientX - eraserSize / 2, e.clientY - eraserSize / 2, eraserSize, eraserSize);
        ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(e.clientX - eraserSize / 2, e.clientY - eraserSize / 2, eraserSize, eraserSize);
      }
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    //@ts-ignore
    const selectedTool = window.selectedTool;
    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      shape = {
        type: "react",
        x: startX,
        y: startY,
        height,
        width,
      };
    } else if (selectedTool === "circle") {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: "circle",
        radius: radius,
        centerX: startX + radius,
        centerY: startY + radius,
      };
    } else if (selectedTool === "eraser") {
      shape = {
        type: "eraser",
        x: e.clientX,
        y: e.clientY,
        width: 30,
        height: 30,
      };
    }
    if (shape) {
      existingShapes.push(shape);
    }
  });
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.forEach((shape) => {
    if (shape.type === "react") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    } else if (shape.type === "eraser") {
      // skip drawing eraser shapes or handle eraser logic if needed
    }
  });
}

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${BASE_URL}/chats/${roomId}`);
  const messages = res.data.messages;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });
  return shapes;
}
