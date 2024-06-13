import { useEffect, useState } from "react";
import { NodeProps, NodeResizer, Handle, Position } from "reactflow";

interface Point {
  x: number;
  y: number;
}

// function smoothWithAdjustableLevel(points: Point[], level: number) {
//   // Проверка на корректность уровня сглаживания
//   if (level < 1 || !Number.isInteger(level)) {
//     throw new Error(
//       "Уровень сглаживания должен быть положительным целым числом.",
//     );
//   }

//   const smoothedPoints = [];
//   const len = points.length;

//   for (let i = 0; i < len; i++) {
//     let sumY = 0;
//     let count = 0;

//     // Суммируем значения y в окне (текущая точка и соседние на заданный уровень)
//     for (let j = -level; j <= level; j++) {
//       if (i + j >= 0 && i + j < len) {
//         sumY += points[i + j].y;
//         count++;
//       }
//     }

//     // Вычисляем среднее значение и добавляем его в массив сглаженных точек
//     smoothedPoints.push({ x: points[i].x, y: sumY / count });
//   }

//   return smoothedPoints;
// }

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
    const threshold = 300;
    const increment = 100;
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
      setSvgSize({ height: 200, width: 200 });
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

  const calculateNaturalSizeOfDrawing = () => {
    const arrayX = points.map(({ x }) => x);
    const arrayY = points.map(({ y }) => y);

    const maxX = Math.max(...arrayX);
    const maxY = Math.max(...arrayY);

    return [maxX, maxY];
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsDrawingPermissionProccess(false);
    const [x, y] = calculateNaturalSizeOfDrawing();
    setSvgSize({ width: x + 10, height: y + 10 });
  };

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={svgSize.width}
        minHeight={svgSize.height}
        keepAspectRatio
      />
      {selected && <Handle type="source" position={Position.Top} id={"0"} />}
      {selected && <Handle type="source" position={Position.Bottom} id={"1"} />}
      {selected && <Handle type="source" position={Position.Left} id={"2"} />}
      {selected && <Handle type="source" position={Position.Right} id={"3"} />}
      <div
        onMouseDown={isDrawingPermissionProccess ? handleMouseDown : undefined}
        onMouseMove={isDrawingPermissionProccess ? handleMouseMove : undefined}
        onMouseUp={isDrawingPermissionProccess ? handleMouseUp : undefined}
        style={{
          width: svgSize.width,
          height: svgSize.height,
          pointerEvents: !isDrawingPermissionProccess ? "none" : undefined,
        }}
      >
        <svg
          style={{
            pointerEvents: !isDrawingPermissionProccess ? "none" : undefined,
          }}
          className="h-full w-full"
        >
          <polyline
            className="bg-opacity-90"
            opacity={0.1}
            pointerEvents="all"
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="blue"
            strokeWidth="10"
          />
        </svg>
      </div>
    </>
  );
}

export const svgDrawerNodeTypes = "SVGDrawerNode";
