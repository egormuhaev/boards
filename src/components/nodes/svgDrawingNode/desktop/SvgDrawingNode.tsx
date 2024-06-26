import {
  NodeProps,
  NodeResizer,
  XYPosition,
  useNodes,
  useReactFlow,
} from "reactflow";
import { PlotSize, Props } from "./types";
import calculateNaturalSizeOfDrawing from "./utils/calculateNaturalSizeOfDrawing";
import { SvgPolyline } from "../SvgPolyline";
import { SvgDrawingNodeHandle } from "../SvgDrawingNodeHandle";
import { useUnit } from "effector-react";
import { $flow } from "@/flow/store/flow.slice";
import { useEffect, useRef } from "react";
import { SvgPath } from "../SvgPath";
import smoothPolyline from "./utils/smoothPolyline";
import resizeSVGContainer from "./utils/resizeSVGContainer";
import normalizationSvgOffset from "./utils/normalizationSvgOffset";
import { DrawTools } from "../constants";
import { changeDrawingInThisMoment } from "@/flow/store/draw.slice";
import { useCreateNewNodeServer } from "@/server/nodes/create/useCreateNewNode";
import { getNodeById } from "@/server/nodes/utils/getNodeById";

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
    tool = DrawTools.Pen,
    isCompletedDrawing = false,
    isDrawing = false,
    plotSize = defaultSvgPlotSize,
    points = [],
    lineColor = "#000",
    lineWidth = 2,
    isActual,
  },
}: NodeProps<Props>) {
  const flowState = useUnit($flow);
  const nodes = useNodes<Props>();
  const { setNodes } = useReactFlow();
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const updateDrawingServer = useCreateNewNodeServer();

  useEffect(() => {
    if (!isDrawing && isCompletedDrawing && !isActual) {
      const nodeCuttentState = getNodeById(id, nodes);
      if (
        points.length > 5 &&
        plotSize.width !== -Infinity &&
        plotSize.height !== -Infinity
      )
        updateDrawingServer(nodeCuttentState);
      setNodesCustom(
        {
          plotSize,
          isActual: true,
          isDrawing: false,
          isCompletedDrawing: true,
          points,
        },
        {
          x: xPos,
          y: yPos,
        },
      );
    }
  }, [isDrawing, isCompletedDrawing]);

  const conditionVizibleHandeTools = selected && !flowState.isDrawingMode;
  const conditionActionsDrawEnable =
    !isCompletedDrawing && flowState.isDrawingMode;

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
      isActual,
    });
    changeDrawingInThisMoment(true);
  };

  const onDrawing = (offsetX: number, offsetY: number) => {
    const { width, height } = resizeSVGContainer(offsetX, offsetY, plotSize);

    setNodesCustom({
      plotSize: { width: width, height: height },
      points: [...points, { x: offsetX, y: offsetY }],
      isDrawing: true,
      isActual,
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
      lineWidth,
    );

    setNodesCustom(
      {
        plotSize: {
          width: maxX - minX,
          height: maxY - minY,
        },
        isActual,
        isDrawing: false,
        isCompletedDrawing: true,
        points: [...currentNormalPoints],
      },
      {
        x: xPos + minX - lineWidth,
        y: yPos + minY - lineWidth,
      },
    );
    changeDrawingInThisMoment(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    onStartDrawing(offsetX, offsetY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    onDrawing(offsetX, offsetY);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    onEndDrawing();
  };

  return (
    <>
      <div
        ref={svgContainerRef}
        onMouseEnter={conditionActionsDrawEnable ? handleMouseDown : undefined}
        onMouseDown={conditionActionsDrawEnable ? handleMouseDown : undefined}
        onMouseMove={conditionActionsDrawEnable ? handleMouseMove : undefined}
        onMouseUp={conditionActionsDrawEnable ? handleMouseUp : undefined}
        onMouseLeave={conditionActionsDrawEnable ? handleMouseUp : undefined}
        style={{
          zIndex: !isCompletedDrawing ? 1000 : 10,
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
          <SvgPolyline
            tool={tool}
            lineColor={lineColor}
            lineWidth={lineWidth}
            points={points.slice(1, points.length)}
            isCompletedDrawing={isCompletedDrawing}
          />
        )}
      </div>
    </>
  );
}

export const svgDrawingNodeTypes = "drawing";
