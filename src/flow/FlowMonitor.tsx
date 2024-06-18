import HelperLines from "@/components/HelperLines";
import Theme from "@/components/Theme";
import { edgeTypes } from "@/components/egdes";
import { ConnectionLine } from "@/components/egdes/ConectionLine";
import { ControlPointData } from "@/components/egdes/EditableEdge";
import { DEFAULT_ALGORITHM } from "@/components/egdes/EditableEdge/constants";
import { nodeTypes } from "@/components/nodes";
// import { ShapeComponents } from "@/components/nodes/shapeNode/ShapeNode";
// import { useControlBoards } from "@/hooks/useControlBoards";
import useCopyPaste from "@/hooks/useCopyPaste";
import useCreateNode, { ShapeNodeTypes } from "@/hooks/useCreateNode";
import useUndoRedo from "@/hooks/useUndoRedo";
import { getHelperLines } from "@/lib/utils";
import { useUnit } from "effector-react";
import {
  DragEvent,
  MouseEvent,
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
  NodeDragHandler,
  OnEdgesDelete,
  OnNodesDelete,
  ReactFlowInstance,
  SelectionDragHandler,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import { v4 } from "uuid";
import FlowHeadToolbar from "./FlowHeadToolbar";
import FlowUndoRedo from "./FlowUndoRedo";
import { config } from "./data";
import {
  $boardPlayground,
  clearBufferCreatingType,
} from "./store/playground.slice";
import { handleDragEvent } from "./utils/randomColor";
import { $flow } from "./store/flow.slice";
import FlowHeadDrawingTools from "./FlowHeadDrawingTools";

// TODO: перенести стили из data в style

const flowKey = "example-flow";

const FlowMonitor = () => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const flowState = useUnit($flow);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const { addFileNode, addNode, addDrawingNode } = useCreateNode(inputFileRef);

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

  // useEffect(() => {
  //   const ls = localStorage.getItem(flowKey);
  //   if (!ls) return;

  //   const flow = JSON.parse(ls);

  //   if (flow) {
  //     const { x = 0, y = 0, zoom = 1 } = flow.viewport;
  //     setNodes(flow.nodes || []);
  //     setEdges(flow.edges || []);
  //     setViewport({ x, y, zoom });
  //   }
  // }, []);

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

  useEffect(() => {
    saveFlow();
  }, [nodes, edges]);

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
        addFileNode(position, files);
      } else {
        addNode({ nodeType, subType } as ShapeNodeTypes, position);
      }
    },
    [reactFlowInstance, takeSnapshot, setNodes],
  );

  const onClick = useCallback(
    async (e: MouseEvent<Element>) => {
      if (!buffer?.nodeType || !reactFlowInstance) return;
      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });
      takeSnapshot();
      if (buffer.nodeType === "file") {
        await addFileNode(position);
        clearBufferCreatingType();
      } else if (flowState.isDrawingMode) {
        addDrawingNode(position);
      } else {
        addNode(
          { nodeType: buffer.nodeType, subType: buffer.subType },
          position,
        );
        clearBufferCreatingType();
      }
    },
    [buffer, nodes],
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
    [buffer, nodes],
  );

  const onNodeDragStart: NodeDragHandler = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onSelectionDragStart: SelectionDragHandler = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onNodesDelete: OnNodesDelete = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onEdgesDelete: OnEdgesDelete = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  return (
    <>
      {/* Инпут находится снаружи, чтобы искусственный клик по нему не вызывал заново функцию onClick */}
      <input multiple type="file" ref={inputFileRef} hidden />
      <ReactFlow
        onInit={setReactFlowInstance}
        onPaneClick={!flowState.isDrawingMode ? onClick : undefined}
        onTouchStart={(e: TouchEvent) => {
          if (flowState.isDrawingMode) {
            return onMobileClick(e);
          } else return null;
        }}
        onMouseDown={(e: MouseEvent) => {
          if (flowState.isDrawingMode) {
            return onClick(e);
          } else return null;
        }}
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
        // НАСТРОЙКИ
        zoomOnDoubleClick={!flowState.isDrawingMode}
        nodesDraggable={!flowState.isDrawingMode}
        panOnDrag={!flowState.isDrawingMode}
        zoomOnScroll

        //onlyRenderVisibleElements={true} // Оптимизация: Скрытие элементов вне поле зрения
      >
        <Theme />
        <FlowUndoRedo />
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
