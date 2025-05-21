type Point = { x: number; y: number };

type ShapeData =
  | { type: "circle"; x: number; y: number; r: number }
  | { type: "rect"; x: number; y: number; w: number; h: number }
  | { type: "pencil"; points: Point[] }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number }
  | { type: "arrow"; x1: number; y1: number; x2: number; y2: number }
  | { type: "text"; x: number; y: number; text: string }
  | { type: "eraser"; points: Point[] };

export class Game {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private roomId: string;
  private socket: WebSocket;
  private startX = 0;
  private startY = 0;
  private isDrawing = false;

  private tool: "circle" | "rect" | "pencil" | "line" | "arrow" | "text" | "eraser";

  private shapes: ShapeData[] = [];
  private tempShape: ShapeData | null = null;
  private pencilPoints: Point[] = [];
  private eraserPoints: Point[] = [];
  private textInput: string = "";

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.socket = socket;
    this.tool = "pencil";
    this.clearCanvas();
    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "white";
    this.initListeners();
  }

  setTool(tool: "circle" | "rect" | "pencil" | "line" | "arrow" | "text" | "eraser") {
    this.tool = tool;
    if (tool !== "text") {
      this.textInput = "";
    }
  }

  clearCanvas() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";
  }

  redrawAll() {
    this.clearCanvas();
    for (const shape of this.shapes) {
      this.drawShape(shape);
    }
    if (this.tempShape) this.drawShape(this.tempShape);
  }

// In drawShape method, update eraser drawing:
drawShape(shape: ShapeData) {
  this.ctx.strokeStyle = "white";
  this.ctx.fillStyle = "white";
  this.ctx.lineWidth = 2;

  if (shape.type === "circle") {
    this.ctx.beginPath();
    this.ctx.arc(shape.x, shape.y, shape.r, 0, 2 * Math.PI);
    this.ctx.stroke();
  } else if (shape.type === "rect") {
    this.ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
  } else if (shape.type === "pencil") {
    this.ctx.beginPath();
    if (shape.points.length === 0) return;
    this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
    for (let i = 1; i < shape.points.length; i++) {
      this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
    }
    this.ctx.stroke();
  } else if (shape.type === "line") {
    this.ctx.beginPath();
    this.ctx.moveTo(shape.x1, shape.y1);
    this.ctx.lineTo(shape.x2, shape.y2);
    this.ctx.stroke();
  } else if (shape.type === "arrow") {
    this.drawArrow(shape.x1, shape.y1, shape.x2, shape.y2);
  } else if (shape.type === "text") {
    this.ctx.font = "20px Arial";
    this.ctx.fillText(shape.text, shape.x, shape.y);
  } else if (shape.type === "eraser") {
    // Increased eraser line width and stroke color to black (erase effect)
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 20; // bigger eraser size
    this.ctx.lineCap = "round"; // smooth edges
    this.ctx.beginPath();
    if (shape.points.length === 0) return;
    this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
    for (let i = 1; i < shape.points.length; i++) {
      this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
    }
    this.ctx.stroke();

    // Reset
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "white";
    this.ctx.lineCap = "butt";
  }
}



  drawArrow(x1: number, y1: number, x2: number, y2: number) {
    const ctx = this.ctx;
    const headlen = 10; // length of head in pixels
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(x2, y2);
    ctx.fill();
  }

  initListeners() {
    this.canvas.onmousedown = (e) => {
      this.isDrawing = true;
      const rect = this.canvas.getBoundingClientRect();
      this.startX = e.clientX - rect.left;
      this.startY = e.clientY - rect.top;

      if (this.tool === "pencil") {
        this.pencilPoints = [{ x: this.startX, y: this.startY }];
      } else if (this.tool === "eraser") {
        this.eraserPoints = [{ x: this.startX, y: this.startY }];
      } else if (this.tool === "text") {
        const text = prompt("Enter text:");
        if (text && text.trim().length > 0) {
          const shape: ShapeData = {
            type: "text",
            x: this.startX,
            y: this.startY,
            text,
          };
          this.shapes.push(shape);
          this.emitShape(shape);
          this.redrawAll();
        }
      }
    };

    this.canvas.onmousemove = (e) => {
      if (!this.isDrawing) return;
      const rect = this.canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (this.tool === "pencil") {
        this.pencilPoints.push({ x: currentX, y: currentY });
        this.tempShape = { type: "pencil", points: [...this.pencilPoints] };
        this.redrawAll();
      } else if (this.tool === "eraser") {
        this.eraserPoints.push({ x: currentX, y: currentY });
        this.tempShape = { type: "eraser", points: [...this.eraserPoints] };
        this.redrawAll();
      } else if (this.tool === "circle") {
        const radius = Math.sqrt((currentX - this.startX) ** 2 + (currentY - this.startY) ** 2);
        this.tempShape = { type: "circle", x: this.startX, y: this.startY, r: radius };
        this.redrawAll();
      } else if (this.tool === "rect") {
        const width = currentX - this.startX;
        const height = currentY - this.startY;
        this.tempShape = { type: "rect", x: this.startX, y: this.startY, w: width, h: height };
        this.redrawAll();
      } else if (this.tool === "line" || this.tool === "arrow") {
        this.tempShape = {
          type: this.tool,
          x1: this.startX,
          y1: this.startY,
          x2: currentX,
          y2: currentY,
        } as ShapeData;
        this.redrawAll();
      }
    };

    this.canvas.onmouseup = (e) => {
      if (!this.isDrawing) return;
      this.isDrawing = false;

      if (this.tempShape) {
        this.shapes.push(this.tempShape);
        this.emitShape(this.tempShape);
        this.tempShape = null;
        this.redrawAll();
      }

      if (this.tool === "pencil") {
        this.pencilPoints = [];
      } else if (this.tool === "eraser") {
        this.eraserPoints = [];
      }
    };

    this.canvas.onmouseleave = () => {
      if (this.isDrawing) {
        this.isDrawing = false;
        if (this.tempShape) {
          this.shapes.push(this.tempShape);
          this.emitShape(this.tempShape);
          this.tempShape = null;
          this.redrawAll();
        }
        this.pencilPoints = [];
        this.eraserPoints = [];
      }
    };
  }

  emitShape(shape: ShapeData) {
    this.socket.send(
      JSON.stringify({
        type: "draw",
        roomId: this.roomId,
        shape: shape.type,
        data: shape,
      })
    );
  }

  drawFromServer(shapeType: string, data: any) {
    this.shapes.push(data);
    this.redrawAll();
  }

  destroy() {
    this.canvas.onmousedown = null;
    this.canvas.onmousemove = null;
    this.canvas.onmouseup = null;
    this.canvas.onmouseleave = null;
  }
}
