import { useEffect, useState } from "react";
import { NodeProps, NodeResizer, Handle, Position } from "reactflow";

interface Point {
  x: number;
  y: number;
}

export default function SVGDrawerNode({ selected }: NodeProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isDrawingPermissionProccess, setIsDrawingPermissionProccess] =
    useState(true);
  const [svgSize, setSvgSize] = useState<{
    width: number;
    height: number;
  }>({ width: 400, height: 400 });

  const resizeSVGContainer = (x: number, y: number) => {
    const threshold = 100;
    const increment = 50;
    const { width, height } = svgSize;
    let newWidth = width;
    let newHeight = height;

    if (x >= width - threshold) newWidth += increment;
    if (x <= threshold) newWidth += increment;
    if (y >= height - threshold) newHeight += increment;
    if (y <= threshold) newHeight += increment;

    if (newWidth !== width || newHeight !== height) {
      setSvgSize({ width: newWidth, height: newHeight });
    }
  };

  useEffect(() => {
    if (points.length === 0) {
      setSvgSize({ height: 100, width: 100 });
    }
  }, [points]);

  // Начало рисования
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setPoints([{ x: offsetX, y: offsetY }]);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setPoints((prevPoints) => [...prevPoints, { x: offsetX, y: offsetY }]);
    resizeSVGContainer(offsetX, offsetY);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsDrawingPermissionProccess(false);
  };

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
      <svg
        onMouseDown={isDrawingPermissionProccess ? handleMouseDown : undefined}
        onMouseMove={isDrawingPermissionProccess ? handleMouseMove : undefined}
        onMouseUp={isDrawingPermissionProccess ? handleMouseUp : undefined}
        width={svgSize.width}
        height={svgSize.height}
      >
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    </>
  );
}

export const svgDrawerNodeTypes = "SVGDrawerNode";
