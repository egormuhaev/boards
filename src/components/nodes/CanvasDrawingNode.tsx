import { useRef, useState } from "react";
import { ReactSketchCanvasRef, ReactSketchCanvas } from "react-sketch-canvas";

export default function CanvasDrawingNode() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(10);

  // const handleEraserClick = () => {
  //   setEraseMode(true);
  //   canvasRef.current?.eraseMode(true);
  // };

  // const handlePenClick = () => {
  //   setEraseMode(false);
  //   canvasRef.current?.eraseMode(false);
  // };

  return (
    <ReactSketchCanvas
      ref={canvasRef}
      strokeWidth={strokeWidth}
      eraserWidth={eraserWidth}
    />
  );
}

export const canvasDrawingNodeTypes = "CanvasDrawingNode";
