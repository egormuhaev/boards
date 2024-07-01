// import Theme from "@/components/Theme";
import { edgeTypes } from "@/components/egdes";
import { ConnectionLine } from "@/components/egdes/ConectionLine";
import { ControlPointData } from "@/components/egdes/EditableEdge";
import { DEFAULT_ALGORITHM } from "@/components/egdes/EditableEdge/constants";
import { nodeTypes } from "@/components/nodes";
import useCopyPaste from "@/hooks/useCopyPaste";
import useEvents from "@/hooks/useEvents";
import useUndoRedo from "@/hooks/useUndoRedo";
import { getHelperLines } from "@/lib/utils";
import { useUnit } from "effector-react";
import { DragEvent, useCallback, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  Controls,
  EdgeChange,
  MiniMap,
  NodeChange,
  ReactFlowInstance,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { v4 } from "uuid";
import FlowHeadDrawingTools from "./FlowHeadDrawingTools";
import FlowHeadToolbar from "./FlowHeadToolbar";
import { config } from "./data";
import { $flow } from "./store/flow.slice";
import { $boardPlayground } from "./store/playground.slice";
import { handleDragEvent, uploadFiles } from "./utils/randomColor";
import { $draw } from "./store/draw.slice";

import useInitFlowData from "@/server/useInitFlowData";
import { useNodesChangeServer } from "@/server/useNodesChangeServer";
import { useCreateNewEdges } from "@/server/edges/create/useCreateNewEdges";
import { useEdgesChangeServer } from "@/server/useEdgesChangeServer";
import HelperLines from "@/components/HelperLines";
import FlowHeadPanel from "./FlowHeadPanel";
import { Redo, Undo } from "lucide-react";

const proOptions = {
  account: "paid-pro",
  hideAttribution: true,
};

const FlowMonitor = ({ boardId }: { boardId: string }) => {
  console.log(boardId);

  const [helperLineHorizontal, setHelperLineHorizontal] = useState<number>();
  const [helperLineVertical, setHelperLineVertical] = useState<number>();
  const [, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  useInitFlowData();
  useCopyPaste();
  const functX = useNodesChangeServer();
  const functY = useEdgesChangeServer();
  const createEdgesFunction = useCreateNewEdges();
  const flowState = useUnit($flow);
  const drawState = useUnit($draw);
  const { theme, connectionLinePath } = useUnit($boardPlayground);
  const { takeSnapshot, canRedo, canUndo, undo, redo } = useUndoRedo();
  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const {
    onClick,
    onDrop,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onNodeDragStart,
    onSelectionDragStart,
    onNodesDelete,
    onEdgesDelete,
  } = useEvents();

  const onCustomNodesChange = (changes: NodeChange[]) => {
    setHelperLineHorizontal(undefined);
    setHelperLineVertical(undefined);

    if (
      changes.length === 1 &&
      changes[0].type === "position" &&
      changes[0].dragging &&
      changes[0].position
    ) {
      const helperLines = getHelperLines(changes[0], nodes);

      changes[0].position.x =
        helperLines.snapPosition.x ?? changes[0].position.x;
      changes[0].position.y =
        helperLines.snapPosition.y ?? changes[0].position.y;

      setHelperLineHorizontal(helperLines.horizontal);
      setHelperLineVertical(helperLines.vertical);
    }

    onNodesChange(changes);
    functX(changes);
  };

  const onCustomEdgesChange = (changes: EdgeChange[]) => {
    onEdgesChange(changes);
    functY(changes);
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = {
        ...connection,
        id: `${v4()}-${connection.source}-${connection.target}`,
        type: "editableEdge",
        selected: true,
        data: {
          algorithm: DEFAULT_ALGORITHM,
          points: connectionLinePath.map(
            (point, i) =>
              ({
                ...point,
                data: {
                  lineColor: "#000",
                  lineWidth: 2,
                },
                id: v4(),
                prev: i === 0 ? undefined : connectionLinePath[i - 1],
                active: true,
              }) as ControlPointData,
          ),
        },
      };

      takeSnapshot();
      createEdgesFunction({
        ...edge,
        source: connection.source!,
        sourceHandle: connection.sourceHandle,
        target: connection.target!,
        targetHandle: connection.targetHandle,
      });

      setEdges((edges) => addEdge(edge, edges));
    },
    [setEdges, takeSnapshot],
  );

  return (
    <ReactFlow
      onInit={setReactFlowInstance}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onContextMenu={(e) => e.preventDefault()}
      onDrop={onDrop}
      onConnect={onConnect}
      onDragOver={handleDragEvent}
      onDragEnter={handleDragEvent}
      onDragLeave={handleDragEvent}
      onNodesChange={onCustomNodesChange}
      onEdgesChange={onCustomEdgesChange}
      edges={edges}
      nodes={nodes}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      connectionMode={ConnectionMode.Loose}
      minZoom={config.minZoom}
      maxZoom={config.maxZoom}
      connectionLineComponent={ConnectionLine}
      onNodeDragStart={onNodeDragStart}
      onSelectionDragStart={onSelectionDragStart}
      onNodesDelete={onNodesDelete}
      onEdgesDelete={onEdgesDelete}
      onNodeDragStop={() => console.log("drag stop")}
      onEdgeUpdateEnd={() => console.log("edge update end")}
      className={theme}
      zoomOnDoubleClick={!flowState.isDrawingMode}
      nodesDraggable={!flowState.isDrawingMode}
      panOnDrag={false} // Нужно для того чтобы карта не двигалась при рисовании и создании ноды ресайзингом
      zoomOnScroll
      panOnScroll
      proOptions={proOptions}
      elevateNodesOnSelect={!flowState.isDrawingMode}
      onlyRenderVisibleElements={!flowState.isDrawingMode} // Оптимизация: Скрытие элементов вне
    >
      {/* {!drawState.drawingInThisMoment && <Theme />} */}

      {!drawState.drawingInThisMoment && <FlowHeadPanel />}

      {!drawState.drawingInThisMoment && (
        <div className="absolute z-50 bottom-5 left-1/2 -translate-x-1/2 bg-white border border=solid-1 border-slate-300 rounded-lg flex gap-2 p-2">
          <button disabled={canUndo} onClick={undo}>
            <Undo color={!canUndo ? "black" : "#e5e7eb"} />
          </button>
          <button disabled={canRedo} onClick={redo}>
            <Redo color={!canRedo ? "black" : "#e5e7eb"} />
          </button>
        </div>
      )}

      {!drawState.drawingInThisMoment && <FlowHeadToolbar />}

      {flowState.isDrawingMode && !drawState.drawingInThisMoment && (
        <FlowHeadDrawingTools />
      )}

      <Background color="#ccc" variant={BackgroundVariant.Cross} size={2} />

      {!drawState.drawingInThisMoment && (
        <Controls showZoom showFitView showInteractive className="text-black" />
      )}

      <HelperLines
        horizontal={helperLineHorizontal}
        vertical={helperLineVertical}
      />

      {!drawState.drawingInThisMoment && (
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      )}
    </ReactFlow>
  );
};

export default FlowMonitor;
