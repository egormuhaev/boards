import { useEffect, useState } from "react";
import { NodeProps, NodeResizer } from "reactflow";
import { Point, PlotSize } from "./types";
import calculateNaturalSizeOfDrawing from "./utils/calculateNaturalSizeOfDrawing";
import { SvgPolyline } from "./SvgPolyline";
import { SvgDrawingNodeHandle } from "./SvgDrawingNodeHandle";

const defaultSvgPlotSize: PlotSize = {
  width: 400,
  height: 400,
};

export default function SvgDrawingNode({ selected }: NodeProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isCompletedDrawing, setIsCompletedDrawing] = useState(true);
  const [plotSize, setPlotSize] = useState<PlotSize>(defaultSvgPlotSize);

  useEffect(() => {
    if (points.length === 0) {
      setPlotSize({ height: 200, width: 200 });
    }
  }, [points]);

  const resizeSVGContainer = (x: number, y: number) => {
    const threshold = 300;
    const increment = 100;
    const { width, height } = plotSize;
    let newWidth = width;
    let newHeight = height;

    if (x >= width - threshold) newWidth += increment;
    if (x <= threshold) newWidth += increment;
    if (y >= height - threshold) newHeight += increment;
    if (y <= threshold) newHeight += increment;

    if (newWidth !== width || newHeight !== height) {
      setPlotSize({ width: newWidth, height: newHeight });
    }
  };

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

  const handleMouseUp = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDrawing(false);
    setIsCompletedDrawing(false);
    const [x, y] = calculateNaturalSizeOfDrawing(points);
    setPlotSize({ width: x + 10, height: y + 10 });
  };

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={plotSize.width}
        minHeight={plotSize.height}
        keepAspectRatio
      />
      <SvgDrawingNodeHandle visible={selected} />
      <div
        onMouseDown={isCompletedDrawing ? handleMouseDown : undefined}
        onMouseMove={isCompletedDrawing ? handleMouseMove : undefined}
        onMouseUp={isCompletedDrawing ? handleMouseUp : undefined}
        style={{
          width: plotSize.width,
          height: plotSize.height,
          pointerEvents: !isCompletedDrawing ? "none" : undefined,
        }}
      >
        <SvgPolyline points={points} isCompletedDrawing={isCompletedDrawing} />
      </div>
    </>
  );
}

export const svgDrawingNodeTypes = "SVGDrawingNode";
