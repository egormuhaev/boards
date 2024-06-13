import ReactFlow, {
  addEdge,
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
} from "reactflow";
import {
  $boardPlayground,
  setIsMovementPlayground,
} from "./store/playground.slice";
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
import { edgeTypes } from "./data";
import { NodeTypes } from "@/components/nodes";
import CanvasNode from "@/components/nodes/CanvasNode";
import CircleNode from "@/components/nodes/CircleNode";
import FileNode from "@/components/nodes/FileNode";
import PDFNode from "@/components/nodes/PDFNode";
import PictureNode from "@/components/nodes/PictureNode";
import RectangleNode from "@/components/nodes/RectangleNode";
import TextNode from "@/components/nodes/TextNode";
import VideoNode from "@/components/nodes/VideoNode";
import useCreateNode from "@/hooks/useCreateNode";

//TODO: DnD файла

export const nodeTypes = {
  [NodeTypes.CanvasNodeFlowTypes]: CanvasNode,
  [NodeTypes.RectangleNodeFlowTypes]: RectangleNode,
  [NodeTypes.CircleNodeFlowTypes]: CircleNode,
  [NodeTypes.TextNodeFlowTypes]: TextNode,
  [NodeTypes.VideoNodeFlowTypes]: VideoNode,
  [NodeTypes.FileNodeFlowTypes]: FileNode,
  [NodeTypes.PictureNodeFlowTypes]: PictureNode,
  [NodeTypes.PDFNodeFlowTypes]: PDFNode,
};

export const fileTypes: Record<string, NodeTypes> = {
  pdf: NodeTypes.PDFNodeFlowTypes,
  jpeg: NodeTypes.PictureNodeFlowTypes,
  jpg: NodeTypes.PictureNodeFlowTypes,
  png: NodeTypes.PictureNodeFlowTypes,
  mov: NodeTypes.VideoNodeFlowTypes,
  mp4: NodeTypes.VideoNodeFlowTypes,
  webm: NodeTypes.VideoNodeFlowTypes,
};

const FlowMonitor = () => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const { addFileNode, addNode } = useCreateNode(inputFileRef);

  const { connectionLinePath } = useUnit($boardPlayground);
  const { buffer } = useUnit($boardPlayground);
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

      if (type === NodeTypes.FileNodeFlowTypes) {
        addFileNode(position, files);
      } else {
        addNode(type as NodeTypes, position);
      }
    },
    [reactFlowInstance, takeSnapshot, setNodes]
  );

  const onClick = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      if (!buffer?.creatingType || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      if (buffer.creatingType === NodeTypes.FileNodeFlowTypes) {
        await addFileNode(position);
      } else {
        addNode(buffer.creatingType, position);
      }
    },
    [buffer, nodes]
  );

  return (
    <>
      {/* Инпут находится снаружи, чтобы искусственный клик по нему не вызывал заново функцию onClick */}
      <input type="file" ref={inputFileRef} hidden />
      <ReactFlow
        onInit={setReactFlowInstance}
        onClick={onClick}
        onContextMenu={(e) => e.preventDefault()}
        onDrop={onDrop}
        onConnect={onConnect}
        onDragOver={handleDragEvent}
        onDragEnter={handleDragEvent}
        onDragLeave={handleDragEvent}
        onNodesChange={onCustomNodesChange}
        onEdgesChange={onCustomEdgesChange}
        onMoveStart={() => setIsMovementPlayground(true)}
        onMoveEnd={() => setIsMovementPlayground(false)}
        selectionOnDrag
        edges={edges}
        nodes={nodes}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        minZoom={0.1}
        maxZoom={500}
        connectionLineComponent={ConnectionLine}
      >
        <FlowUndoRedo />

        <FlowHeadToolbar />

        <Background color="#ccc" variant={BackgroundVariant.Cross} size={1} />

        <Controls />

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
