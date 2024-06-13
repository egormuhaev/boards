import { Handle, NodeProps, Position, NodeResizer } from "reactflow";
import { useState, useRef, useEffect } from "react";

interface Point {
  x: number;
  y: number;
}

const CanvasNode = ({ selected }: NodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isDragComplete, setIsDragComplete] = useState<boolean>(true);
  const [lines, setLines] = useState<Point[][]>([]);
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  }>({ width: 400, height: 400 });

  const resizeCanvas = (x: number, y: number) => {
    const threshold = 100;
    const increment = 50;
    const { width, height } = canvasSize;
    let newWidth = width;
    let newHeight = height;

    if (x >= width - threshold) newWidth += increment;
    if (x <= threshold) newWidth += increment;
    if (y >= height - threshold) newHeight += increment;
    if (y <= threshold) newHeight += increment;

    if (newWidth !== width || newHeight !== height) {
      setCanvasSize({ width: newWidth, height: newHeight });
    }
  };

  const startDrawing = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const { offsetX, offsetY } = event.nativeEvent;
    setIsDrawing(true);
    setLines((prevLines) => [...prevLines, [{ x: offsetX, y: offsetY }]]);
  };

  const draw = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    setLines((prevLines) => {
      const newLines = [...prevLines];
      newLines[newLines.length - 1].push({ x: offsetX, y: offsetY });
      return newLines;
    });
    resizeCanvas(offsetX, offsetY);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setIsDragComplete(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Устанавливаем новый размер холста
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Очищаем холст
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовываем линии
    lines.forEach((line) => {
      context.beginPath();
      for (let i = 0; i < line.length - 1; i++) {
        const start = line[i];
        const end = line[i + 1];
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
      }
      context.stroke();
    });
  }, [lines, canvasSize]);

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={180}
        minHeight={68}
        keepAspectRatio
      />
      {selected && <Handle type="source" position={Position.Top} id={"0"} />}
      {selected && <Handle type="source" position={Position.Bottom} id={"1"} />}
      {selected && <Handle type="source" position={Position.Left} id={"2"} />}
      {selected && <Handle type="source" position={Position.Right} id={"3"} />}
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={isDragComplete ? startDrawing : undefined}
        onMouseMove={isDragComplete ? draw : undefined}
        onMouseUp={isDragComplete ? stopDrawing : undefined}
        onMouseLeave={isDragComplete ? stopDrawing : undefined}
      />
    </>
  );
};

export const canvasNodeFlowTypes = "canvasNode";

export default CanvasNode;
