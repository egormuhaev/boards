import {
  NodeProps,
  NodeResizer,
  XYPosition,
  useNodes,
  useReactFlow,
} from "reactflow";
import { PlotSize, Props } from "./types";
import calculateNaturalSizeOfDrawing from "./utils/calculateNaturalSizeOfDrawing";
import { SvgPolyline } from "./SvgPolyline";
import { SvgDrawingNodeHandle } from "./SvgDrawingNodeHandle";
import { useUnit } from "effector-react";
import { $flow } from "@/flow/store/flow.slice";
import { useRef } from "react";
import { SvgPath } from "./SvgPath";
import smoothPolyline from "./utils/smoothPolyline";
import resizeSVGContainer from "./utils/resizeSVGContainer";
import normalizationSvgOffset from "./utils/normalizationSvgOffset";

const defaultSvgPlotSize: PlotSize = {
  width: window.screen.height * 2,
  height: window.screen.width * 2,
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

  const conditionVizibleHandeTools = selected && !flowState.isDrawingMode;
  const conditionActionsDrawEnable =
    !isCompletedDrawing && flowState.isDrawingMode;

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

    const currentNormalPoints = normalizationSvgOffset(
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

    const newSize = resizeSVGContainer(offsetX, offsetY, plotSize);
    if (newSize !== null) {
      setNodesCustom({
        plotSize: { width: newSize.width, height: newSize.height },
      });
    }
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

    const newSize = resizeSVGContainer(x, y, plotSize);
    if (newSize !== null) {
      setNodesCustom({
        plotSize: { width: newSize.width, height: newSize.height },
      });
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    onEndDrawing();
  };

  return (
    <>
      <NodeResizer
        isVisible={conditionVizibleHandeTools}
        minWidth={plotSize.width}
        minHeight={plotSize.height}
        maxWidth={plotSize.width}
        maxHeight={plotSize.height}
      />
      <SvgDrawingNodeHandle visible={conditionVizibleHandeTools} />
      <div
        ref={svgContainerRef}
        onMouseEnter={conditionActionsDrawEnable ? handleMouseDown : undefined}
        onMouseDown={conditionActionsDrawEnable ? handleMouseDown : undefined}
        onMouseMove={conditionActionsDrawEnable ? handleMouseMove : undefined}
        onMouseUp={conditionActionsDrawEnable ? handleMouseUp : undefined}
        onTouchStart={onTouchDown as any}
        onTouchMove={onTouchMove as any}
        onTouchEnd={onTouchEnd as any}
        style={{
          zIndex: 1000,
          width: plotSize.width,
          height: plotSize.height,
        }}
      >
        {isCompletedDrawing && (
          <SvgPath
            // path={smoothPolyline(points.slice(1, points.length))}
            path={smoothPolyline(points)}
            isCompletedDrawing={isCompletedDrawing}
          />
        )}
        {!isCompletedDrawing && (
          <SvgPolyline
            points={points.slice(1, points.length)}
            isCompletedDrawing={isCompletedDrawing}
          />
        )}
      </div>
    </>
  );
}

export const svgDrawingNodeTypes = "svgDrawingNodeTypes";
