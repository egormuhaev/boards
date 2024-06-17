import {
  NodeProps,
  NodeResizer,
  XYPosition,
  useNodes,
  useReactFlow,
} from "reactflow";
import { PlotSize, Point, Props } from "./types";
import calculateNaturalSizeOfDrawing from "./utils/calculateNaturalSizeOfDrawing";
import { SvgPolyline } from "./SvgPolyline";
import { SvgDrawingNodeHandle } from "./SvgDrawingNodeHandle";
import { useUnit } from "effector-react";
import { $flow } from "@/flow/store/flow.slice";
import { useRef } from "react";

const defaultSvgPlotSize: PlotSize = {
  width: window.screen.availWidth * 2,
  height: window.screen.availHeight * 2,
};

const normalizationSvg = (minX: number, minY: number, points: Point[]) => {
  return points.map((point: Point) => {
    return {
      x: point.x - minX,
      y: point.y - minY,
    };
  });
};

export default function SvgDrawingNode({
  selected,
  id,
  xPos,
  yPos,
  data: {
    isCompletedDrawing = false,
    isDrawing = false,
    plotSize = defaultSvgPlotSize,
    points = [],
  },
}: NodeProps<Props>) {
  const flowState = useUnit($flow);

  const nodes = useNodes<Props>();
  const { setNodes } = useReactFlow();
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const getNativeTouchScreenCoordinate = (e: TouchEvent) => {
    if (svgContainerRef.current) {
      const rect = svgContainerRef.current.getBoundingClientRect();
      const touch = e.touches[0];

      return {
        x: touch.clientX - rect.x,
        y: touch.clientY - rect.y,
      };
    }

    return [0, 0];
  };

  const setNodesCustom = (args: Props, position?: XYPosition) => {
    setNodes(
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            position: position ?? node.position,
            data: {
              ...node.data,
              ...args,
            },
          };
        }
        return node;
      }),
    );
  };

  const onStartDrawing = (offsetX: number, offsetY: number) => {
    setNodesCustom({
      points: [{ x: offsetX, y: offsetY }],
      isDrawing: true,
    });
  };

  const onDrawing = (offsetX: number, offsetY: number) => {
    setNodesCustom({
      points: [...points, { x: offsetX, y: offsetY }],
      isDrawing: true,
    });
  };

  const onEndDrawing = () => {
    const [maxX, maxY, minX, minY] = calculateNaturalSizeOfDrawing(
      points.slice(1, points.length),
    );
    const currentNormalPoints = normalizationSvg(
      minX,
      minY,
      points.slice(1, points.length),
    );

    setNodesCustom(
      {
        plotSize: {
          width: maxX - minX,
          height: maxY - minY,
        },
        isDrawing: false,
        isCompletedDrawing: true,
        points: [...currentNormalPoints],
      },

      {
        x: xPos + minX,
        y: yPos + minY,
      },
    );
  };

  const resizeSVGContainer = (x: number, y: number) => {
    const threshold = 300;
    const increment = 500;
    const { width, height } = plotSize;
    let newWidth = width;
    let newHeight = height;

    if (x >= width - threshold) newWidth += increment;
    if (x <= threshold) newWidth += increment;
    if (y >= height - threshold) newHeight += increment;
    if (y <= threshold) newHeight += increment;

    if (newWidth !== width || newHeight !== height) {
      setNodesCustom({ plotSize: { width: newWidth, height: newHeight } });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const { offsetX, offsetY } = e.nativeEvent;
    onStartDrawing(offsetX, offsetY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    onDrawing(offsetX, offsetY);
    resizeSVGContainer(offsetX, offsetY);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    onEndDrawing();
  };

  const onTouchDown = (e: TouchEvent) => {
    const { x, y } = getNativeTouchScreenCoordinate(e);
    onStartDrawing(x, y);
  };

  const onTouchMove = (e: TouchEvent) => {
    const { x, y } = getNativeTouchScreenCoordinate(e);
    onDrawing(x, y);
    resizeSVGContainer(x, y);
  };

  const onTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    onEndDrawing();
  };

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={plotSize.width}
        minHeight={plotSize.height}
      />
      <SvgDrawingNodeHandle visible={!flowState.isDrawingMode || selected} />
      <div
        ref={svgContainerRef}
        onMouseEnter={
          !isCompletedDrawing && flowState.isDrawingMode
            ? handleMouseDown
            : undefined
        }
        onMouseDown={
          !isCompletedDrawing && flowState.isDrawingMode
            ? handleMouseDown
            : undefined
        }
        onMouseMove={
          !isCompletedDrawing && flowState.isDrawingMode
            ? handleMouseMove
            : undefined
        }
        onMouseUp={
          !isCompletedDrawing && flowState.isDrawingMode
            ? handleMouseUp
            : undefined
        }
        onTouchStart={onTouchDown as any}
        onTouchMove={onTouchMove as any}
        onTouchEnd={onTouchEnd as any}
        style={{
          zIndex: 1000,
          width: plotSize.width,
          height: plotSize.height,
        }}
      >
        <SvgPolyline
          points={points.slice(1, points.length)}
          isCompletedDrawing={isCompletedDrawing}
        />
      </div>
    </>
  );
}

export const svgDrawingNodeTypes = "drawing";
