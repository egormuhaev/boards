import {
  NodeProps,
  NodeResizer,
  XYPosition,
  useReactFlow,
  Node,
} from "reactflow";
import { PlotSize, Props } from "../types";
import calculateNaturalSizeOfDrawing from "../utils/calculateNaturalSizeOfDrawing";
import { SvgDrawingNodeHandle } from "../SvgDrawingNodeHandle";
import { useUnit } from "effector-react";
import { $flow } from "@/flow/store/flow.slice";
import { useRef } from "react";
import { SvgPath } from "../SvgPath";
import smoothPolyline from "../utils/smoothPolyline";
import resizeSVGContainer from "../utils/resizeSVGContainer";
import normalizationSvgOffset from "../utils/normalizationSvgOffset";
import { DrawTools } from "../constants";
import { $draw, changeDrawingInThisMoment } from "@/flow/store/draw.slice";
import { useCreateNewNodeServer } from "@/server/nodes/create/useCreateNewNode";
import { getNodeById } from "@/server/nodes/utils/getNodeById";
import { v4 } from "uuid";

const defaultSvgPlotSize: PlotSize = {
  width: window.screen.height * 2,
  height: window.screen.width * 2,
};

export default function DrawingMobileNode({
  selected,
  id,
  xPos,
  yPos,
  data: {
    tool = DrawTools.Pen,
    isCompletedDrawing = false,
    plotSize = defaultSvgPlotSize,
    points = [],
    lineColor = "#000",
    lineWidth = 2,
    isActual,
  },
}: NodeProps<Props>) {
  const flowState = useUnit($flow);
  const drawState = useUnit($draw);
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const { createNewNode } = useCreateNewNodeServer();

  const conditionVizibleHandeTools = selected && !flowState.isDrawingMode;
  !isActual && !isCompletedDrawing && flowState.isDrawingMode;

  const getNativeTouchScreenCoordinate = (e: TouchEvent) => {
    if (svgContainerRef.current) {
      const rect = svgContainerRef.current.getBoundingClientRect();

      const targetRect = screenToFlowPosition({
        x: rect.x,
        y: rect.y,
      });

      const touch = screenToFlowPosition({
        x: e.targetTouches[0].clientX!,
        y: e.targetTouches[0].clientY!,
      });

      return {
        x: touch.x - targetRect.x,
        y: touch.y - targetRect.y,
      };
    }

    return {
      x: 0,
      y: 0,
    };
  };

  const setNodesCustom = (args: Props, position?: XYPosition) => {
    const nodes = getNodes();
    const curentState = getNodeById(id, nodes);
    setNodes([
      ...nodes,
      {
        ...curentState,
        position: position ?? curentState.position,
        data: {
          ...curentState.data,
          ...args,
        },
      },
    ]);
  };

  const onStartDrawing = (offsetX: number, offsetY: number) => {
    setNodesCustom({
      points: [{ x: offsetX, y: offsetY }],
      isDrawing: true,
      lineColor: drawState.color,
      tool: drawState.tool,
      lineWidth: drawState.width,
      isActual: false,
    });
    changeDrawingInThisMoment(true);
  };

  const onDrawing = (offsetX: number, offsetY: number) => {
    const { width, height } = resizeSVGContainer(offsetX, offsetY, plotSize);

    setNodesCustom({
      plotSize: { width: width, height: height },
      points: [...points, { x: offsetX, y: offsetY }],
      lineColor,
      lineWidth,
      tool,
      isDrawing: true,
      isActual: false,
    });
  };

  const onEndDrawing = () => {
    const [maxX, maxY, minX, minY] = calculateNaturalSizeOfDrawing(
      points.slice(1, points.length),
    );

    const nodes = getNodes();

    const currentNormalPoints = normalizationSvgOffset(
      minX,
      minY,
      points.slice(1, points.length),
      lineWidth,
    );

    const newNode: Node<any> = {
      id: v4(),
      type: "drawing",
      zIndex: 1,
      position: {
        x: xPos + minX - lineWidth,
        y: yPos + minY - lineWidth,
      },
      data: {
        lineColor: drawState.color,
        lineWidth: drawState.width,
        tool: drawState.tool,
        plotSize: {
          width: maxX - minX,
          height: maxY - minY,
        },
        isActual: true,
        isDrawing: false,
        isCompletedDrawing: true,
        points: [...currentNormalPoints],
      },
    };

    createNewNode(newNode);
    setNodes(
      [...nodes, newNode].map((node) => {
        if (node.id === id) {
          return {
            ...node,
            zIndex: 100,
            data: {
              ...node.data,
              points: [],
              lineColor: drawState.color,
              lineWidth: drawState.width,
              tool: drawState.tool,
            },
          };
        }
        return node;
      }),
    );
    changeDrawingInThisMoment(false);
  };

  const onTouchStart = (e: TouchEvent) => {
    const { x, y } = getNativeTouchScreenCoordinate(e);
    onStartDrawing(x, y);
  };
  const onTouchMove = (e: TouchEvent) => {
    const { x, y } = getNativeTouchScreenCoordinate(e);
    onDrawing(x, y);
  };
  const onTouchEnd = (_: TouchEvent) => {
    onEndDrawing();
  };

  return (
    <>
      <div
        ref={svgContainerRef}
        onTouchStart={onTouchStart as any}
        onTouchMove={onTouchMove as any}
        onTouchEnd={onTouchEnd as any}
        style={{
          zIndex: 1000,
          width: plotSize.width + lineWidth * 2,
          height: plotSize.height + lineWidth * 2,
        }}
      >
        <NodeResizer
          nodeId={id}
          isVisible={conditionVizibleHandeTools}
          minWidth={plotSize.width}
          minHeight={plotSize.height}
          maxWidth={plotSize.width + lineWidth}
          maxHeight={plotSize.height + lineWidth}
        />
        <SvgDrawingNodeHandle visible={conditionVizibleHandeTools} />

        {isCompletedDrawing && (
          <SvgPath
            tool={tool}
            lineColor={lineColor}
            lineWidth={lineWidth}
            path={smoothPolyline(points)}
            isCompletedDrawing={isCompletedDrawing}
          />
        )}
        {!isCompletedDrawing && (
          <SvgPath
            tool={tool}
            lineColor={lineColor}
            lineWidth={lineWidth}
            path={smoothPolyline(points.slice(1, points.length))}
            isCompletedDrawing={isCompletedDrawing}
          />
        )}
      </div>
    </>
  );
}
