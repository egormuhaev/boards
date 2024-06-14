import ReactFlow, {
  addEdge,
  Node,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  EdgeChange,
  Connection,
  ConnectionMode,
  ReactFlowInstance,
  useNodesState,
  useEdgesState,
  NodeChange,
  NodeDragHandler,
  SelectionDragHandler,
  OnNodesDelete,
  OnEdgesDelete,
} from "reactflow";
import { $boardPlayground } from "./store/playground.slice";
import { useUnit } from "effector-react";
import FlowHeadToolbar from "./FlowHeadToolbar";
import { ControlPointData } from "@/components/egdes/EditableEdge";
import { DEFAULT_ALGORITHM } from "@/components/egdes/EditableEdge/constants";
import { v4 } from "uuid";
import { ConnectionLine } from "@/components/egdes/ConectionLine";
import { DragEvent, MouseEvent, useCallback, useRef, useState } from "react";
import { getHelperLines } from "@/lib/utils";
import HelperLines from "@/components/HelperLines";
import useCopyPaste from "@/hooks/useCopyPaste";
import { handleDragEvent } from "./utils/randomColor";
import FlowUndoRedo from "./FlowUndoRedo";
import useUndoRedo from "@/hooks/useUndoRedo";
import useCreateNode from "@/hooks/useCreateNode";
import { edgeTypes } from "@/components/egdes";
import { NodeTypes, nodeTypes } from "@/components/nodes";
import { config } from "./data";
import Theme from "@/components/Theme";
import { useControlBoards } from "@/hooks/useControlBoards";

const initNodesWithSwgDrawer: Node[] = [
  {
    id: "svg-drawer-test",
    type: NodeTypes.SVGDrawingNodeTypes,
    position: { x: 0, y: 0 },
    data: {},
  },
];

const FlowMonitor = () => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initNodesWithSwgDrawer
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  useControlBoards();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const { addFileNode, addNode } = useCreateNode(inputFileRef);

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

      const type = e.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const files = e.dataTransfer.files;

      takeSnapshot();

      if (type === NodeTypes.FileNodeFlowTypes) {
        addFileNode(position, files);
      } else {
        addNode(type as NodeTypes, position);
      }
    },
    [reactFlowInstance, takeSnapshot, setNodes]
  );

  const onClick = useCallback(
    async (e: MouseEvent<Element>) => {
      if (!buffer?.creatingType || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      takeSnapshot();

      if (buffer.creatingType === NodeTypes.FileNodeFlowTypes) {
        await addFileNode(position);
      } else {
        addNode(buffer.creatingType, position);
      }
    },
    [buffer, nodes]
  );

  const onNodeDragStart: NodeDragHandler = useCallback(() => {
    takeSnapshot();
    // 👉 you can place your event handlers here
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
      <input type="file" ref={inputFileRef} hidden />
      <ReactFlow
        onInit={setReactFlowInstance}
        onPaneClick={onClick}
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
        nodesDraggable={true}
        panOnDrag={true}
        zoomOnScroll
        elevateNodesOnSelect={false} // Выключение автоматического повышения z-index элемента при его выделении
        onlyRenderVisibleElements={true} // Оптимизация: Скрытие элементов вне поле зрения
      >
        <Theme />

        <FlowUndoRedo />

        <FlowHeadToolbar />

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
