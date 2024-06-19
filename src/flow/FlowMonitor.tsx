import HelperLines from "@/components/HelperLines";
import Theme from "@/components/Theme";
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
import {
  DragEvent,
  TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  Controls,
  EdgeChange,
  MiniMap,
  NodeChange,
  Panel,
  ReactFlowInstance,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { v4 } from "uuid";
import FlowHeadDrawingTools from "./FlowHeadDrawingTools";
import FlowHeadToolbar from "./FlowHeadToolbar";
import FlowUndoRedo from "./FlowUndoRedo";
import { config } from "./data";
import { $flow } from "./store/flow.slice";
import { $boardPlayground } from "./store/playground.slice";
import { handleDragEvent } from "./utils/randomColor";
import useMouseEvents from "@/hooks/useMouseEvents";

const flowKey = "example-flow";

const FlowMonitor = () => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const flowState = useUnit($flow);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const { setViewport } = useReactFlow();

  const { addFileNode, addNode, addDrawingNode } = useCreateNode(inputFileRef);

  const {
    onNodeDragStart,
    onSelectionDragStart,
    onNodesDelete,
    onEdgesDelete,
  } = useEvents();

  const { onClick, onMouseDown, onMouseMove, onMouseUp } = useMouseEvents(
    reactFlowInstance,
    inputFileRef
  );

  const { connectionLinePath } = useUnit($boardPlayground);
  const { buffer, theme } = useUnit($boardPlayground);
  const { takeSnapshot } = useUndoRedo();
  useCopyPaste();

  const [helperLineHorizontal, setHelperLineHorizontal] = useState<number>();
  const [helperLineVertical, setHelperLineVertical] = useState<number>();

  const saveFlow = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  useEffect(() => {
    saveFlow();
  }, [nodes, edges]);

  useEffect(() => {
    const ls = localStorage.getItem(flowKey);
    if (!ls) return;

    const flow = JSON.parse(ls);

    if (flow) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      setViewport({ x, y, zoom });
    }
  }, []);

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
  };

  const onCustomEdgesChange = (changes: EdgeChange[]) => {
    onEdgesChange(changes);
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
              } as ControlPointData)
          ),
        },
      };

      takeSnapshot();
      setEdges((edges) => addEdge(edge, edges));
    },
    [setEdges, takeSnapshot]
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

      const nodeSize = {
        width: 180,
        height: 180,
      };

      if (nodeType === "file") {
        addFileNode(position, files);
      } else {
        addNode({ nodeType, subType } as ShapeNodeTypes, position, nodeSize);
      }
    },
    [reactFlowInstance, takeSnapshot, setNodes]
  );

  const onMobileClick = useCallback(
    async (e: TouchEvent) => {
      if (reactFlowInstance) {
        const position = reactFlowInstance.screenToFlowPosition({
          x: e.changedTouches[0].clientX!,
          y: e.changedTouches[0].clientY!,
        });

        addDrawingNode(position);
      }
    },
    [buffer, nodes]
  );

  const proOptions = { hideAttribution: true };

  return (
    <>
      {/* Инпут находится снаружи, чтобы искусственный клик по нему не вызывал заново функцию onClick */}
      <input multiple type="file" ref={inputFileRef} hidden />

      <ReactFlow
        onInit={setReactFlowInstance}
        onClick={onClick}
        onTouchStart={(e: TouchEvent) => {
          if (flowState.isDrawingMode) {
            return onMobileClick(e);
          } else return null;
        }}
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
        className={theme}
        zoomOnDoubleClick={!flowState.isDrawingMode}
        nodesDraggable={!flowState.isDrawingMode}
        panOnDrag={!(flowState.isDrawingMode || buffer?.nodeType === "shape")} // Нужно для того чтобы карта не двигалась при рисовании и создании ноды ресайзингом
        zoomOnScroll
        proOptions={proOptions}
        //onlyRenderVisibleElements={true} // Оптимизация: Скрытие элементов вне поле зрения
      >
        <Theme />

        <Panel
          position="bottom-center"
          className="w-[100px] flex justify-around z-50 gap-5 p-2 bg-white rounded-lg border border-solid-1 border-slate-300"
        >
          <FlowUndoRedo />
        </Panel>
        <FlowHeadToolbar />
        {flowState.isDrawingMode && <FlowHeadDrawingTools />}
        <Background color="#ccc" variant={BackgroundVariant.Cross} size={2} />
        <Controls showZoom showFitView showInteractive className="text-black" />
        <HelperLines
          horizontal={helperLineHorizontal}
          vertical={helperLineVertical}
        />

        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </>
  );
};

export default FlowMonitor;
