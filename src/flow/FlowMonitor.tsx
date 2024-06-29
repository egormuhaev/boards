// import HelperLines from "@/components/HelperLines";
// import Theme from "@/components/Theme";
import { edgeTypes } from "@/components/egdes";
import { ConnectionLine } from "@/components/egdes/ConectionLine";
import { ControlPointData } from "@/components/egdes/EditableEdge";
import { DEFAULT_ALGORITHM } from "@/components/egdes/EditableEdge/constants";
import { nodeTypes } from "@/components/nodes";
import useCopyPaste from "@/hooks/useCopyPaste";
import useCreateNode, { ShapeNodeTypes } from "@/hooks/useCreateNode";
import useEvents from "@/hooks/useEvents";
import useUndoRedo from "@/hooks/useUndoRedo";
import { getHelperLines } from "@/lib/utils";
import { useUnit } from "effector-react";
import { DragEvent, useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  Controls,
  EdgeChange,
  MiniMap,
  NodeChange,
  // Panel,
  ReactFlowInstance,
  SelectionMode,
  addEdge,
  useEdgesState,
  useNodesState,
  // useReactFlow,
} from "reactflow";
import { v4 } from "uuid";
import FlowHeadDrawingTools from "./FlowHeadDrawingTools";
import FlowHeadToolbar from "./FlowHeadToolbar";
// import FlowUndoRedo from "./FlowUndoRedo";
import { config } from "./data";
import { $flow } from "./store/flow.slice";
import { $boardPlayground } from "./store/playground.slice";
import { handleDragEvent } from "./utils/randomColor";
import useMouseEvents from "@/hooks/useMouseEvents";
import { $draw } from "./store/draw.slice";

import useInitFlowData from "@/server/useInitFlowData";
import { useNodesChangeServer } from "@/server/useNodesChangeServer";
import { useCreateNewEdges } from "@/server/edges/create/useCreateNewEdges";
import { useEdgesChangeServer } from "@/server/useEdgesChangeServer";
import HelperLines from "@/components/HelperLines";
import FlowHeadPanel from "./FlowHeadPanel";

const FlowMonitor = () => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const drawState = useUnit($draw);
  useInitFlowData();
  const functX = useNodesChangeServer();
  const functY = useEdgesChangeServer();
  const { createNewEdge } = useCreateNewEdges();

  const proOptions = {
    account: "paid-pro",
    hideAttribution: true,
  };

  const flowState = useUnit($flow);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const { addFileNode, addShapeNode, addTextNode } =
    useCreateNode(inputFileRef);

  const {
    onNodeDragStart,
    onSelectionDragStart,
    onNodesDelete,
    onEdgesDelete,
  } = useEvents();

  const { onClick, onMouseDown, onMouseMove, onMouseUp } =
    useMouseEvents(inputFileRef);

  const { connectionLinePath } = useUnit($boardPlayground);
  const { buffer, theme } = useUnit($boardPlayground);
  const { takeSnapshot } = useUndoRedo();
  useCopyPaste();

  const [helperLineHorizontal, setHelperLineHorizontal] = useState<number>();
  const [helperLineVertical, setHelperLineVertical] = useState<number>();

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
                  lineWidth: 4,
                },
                id: v4(),
                prev: i === 0 ? undefined : connectionLinePath[i - 1],
                active: true,
              }) as ControlPointData,
          ),
        },
      };

      takeSnapshot();
      createNewEdge({
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

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      handleDragEvent(e);

      if (!reactFlowInstance) return;

      const nodeType = e.dataTransfer.getData("nodeType");
      if (!nodeType) return;

      const subType = e.dataTransfer.getData("subType");

      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const files = e.dataTransfer.files;

      takeSnapshot();

      if (nodeType === "file") {
        const nodeSize = {
          width: 500,
          height: 600,
        };

        addFileNode(position, nodeSize, files);
      } else if (nodeType === "text") {
        const nodeSize = {
          width: 180,
          height: 40,
        };

        addTextNode(position, nodeSize);
      } else {
        const nodeSize = {
          width: 180,
          height: 180,
        };

        addShapeNode(
          { nodeType, subType } as ShapeNodeTypes,
          position,
          nodeSize,
        );
      }
    },
    [reactFlowInstance, takeSnapshot, setNodes],
  );

  return (
    <>
      <input multiple type="file" ref={inputFileRef} hidden />
      <ReactFlow
        fitView
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
        panOnDrag={!(flowState.isDrawingMode || buffer?.nodeType === "shape")} // Нужно для того чтобы карта не двигалась при рисовании и создании ноды ресайзингом
        zoomOnScroll
        proOptions={proOptions}
        elevateNodesOnSelect={!flowState.isDrawingMode}
        onlyRenderVisibleElements={!flowState.isDrawingMode} // Оптимизация: Скрытие элементов вне
      >
        {/* {!drawState.drawingInThisMoment && <Theme />} */}

        {!drawState.drawingInThisMoment && <FlowHeadPanel />}

        {!drawState.drawingInThisMoment && <FlowHeadToolbar />}

        {flowState.isDrawingMode && !drawState.drawingInThisMoment && (
          <FlowHeadDrawingTools />
        )}

        <Background color="#ccc" variant={BackgroundVariant.Cross} size={2} />

        {!drawState.drawingInThisMoment && (
          <Controls
            showZoom
            showFitView
            showInteractive
            className="text-black"
          />
        )}

        <HelperLines
          horizontal={helperLineHorizontal}
          vertical={helperLineVertical}
        />

        {!drawState.drawingInThisMoment && (
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
        )}
      </ReactFlow>
    </>
  );
};

export default FlowMonitor;
