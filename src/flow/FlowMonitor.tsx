import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  NodeChange,
  EdgeChange,
  Connection,
  OnConnect,
  ConnectionMode,
} from "reactflow";
import {
  $boardPlayground,
  changeNode,
  changeEdge,
  setIsMovementPlayground,
  addNewNode,
} from "./store/playground.slice";
import { $flow } from "./store/flow.slice";
import { useUnit } from "effector-react";
import FlowHeadToolbar from "./FlowHeadToolbar";
import FlowHeadParamsNode from "./FlowHeadParamsNode";
import { ControlPointData } from "@/components/egdes/EditableEdge";
import { DEFAULT_ALGORITHM } from "@/components/egdes/EditableEdge/constants";
import { v4 } from "uuid";
import { ConnectionLine } from "@/components/egdes/ConectionLine";
import React, { DragEvent } from "react";
import { NodeTypes } from "@/components";

const FlowMonitor = () => {
  const playgroundState = useUnit($boardPlayground);
  const flowState = useUnit($flow);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = (changes: NodeChange[]) => {
    if (!flowState.isDrawingMode) {
      return changeNode(applyNodeChanges(changes, playgroundState.nodes));
    }
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    if (!flowState.isDrawingMode) {
      changeEdge(applyEdgeChanges(changes, playgroundState.edges));
    }
  };

  const onConnect: OnConnect = (connection: Connection) => {
    const edge = {
      ...connection,
      id: `${Date.now()}-${connection.source}-${connection.target}`,
      type: "editableEdge",
      selected: true,
      data: {
        algorithm: DEFAULT_ALGORITHM,
        points: playgroundState.connectionLinePath.map(
          (point, i) =>
            ({
              ...point,
              data: {
                lineColor: "#000",
                lineWidth: 2,
              },
              id: v4(),
              prev:
                i === 0 ? undefined : playgroundState.connectionLinePath[i - 1],
              active: true,
            } as ControlPointData)
        ),
      },
    };

    changeEdge(addEdge(edge, playgroundState.edges));
  };

  const addNewItemPlaygroud = (e: React.MouseEvent) => {
    if (!flowState.isDrawingMode) {
      if (playgroundState.create !== null) {
        addNewNode({
          data: {},
          type: playgroundState.create.type ?? "",
          position: screenToFlowPosition({
            x: e.clientX,
            y: e.clientY,
          }),
        });
      }
    }
  };

  const handleDragEvent = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDragEvent(e);

    const files = e.dataTransfer.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
      let type: NodeTypes;

      switch (fileExtension) {
        case "jpeg":
          type = NodeTypes.PictureNodeFlowTypes;
          break;
        case "jpg":
          type = NodeTypes.PictureNodeFlowTypes;
          break;
        case "png":
          type = NodeTypes.PictureNodeFlowTypes;
          break;
        case "mp4":
          type = NodeTypes.VideoNodeFlowTypes;
          break;
        case "webm":
          type = NodeTypes.VideoNodeFlowTypes;
          break;
        default:
          type = NodeTypes.FileNodeFlowTypes;
          break;
      }

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY + i * 100,
      });

      addNewNode({
        data: { file },
        type,
        position,
      });
    }
  };

  return (
    <ReactFlow
      onContextMenu={(e) => e.preventDefault()}
      onClick={addNewItemPlaygroud}
      //
      onDrop={handleDrop}
      onDragOver={handleDragEvent}
      onDragEnter={handleDragEvent}
      onDragLeave={handleDragEvent}
      //
      selectionOnDrag
      // panOnScroll
      edges={playgroundState.edges}
      nodes={playgroundState.nodes}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={playgroundState.nodeTypes}
      edgeTypes={playgroundState.edgeTypes}
      connectionMode={ConnectionMode.Loose}
      maxZoom={200}
      onMoveStart={() => {
        setIsMovementPlayground(true);
      }}
      onMoveEnd={() => {
        setIsMovementPlayground(false);
      }}
      connectionLineComponent={ConnectionLine}
    >
      {playgroundState.create && <FlowHeadParamsNode />}
      <FlowHeadToolbar />
      <Background color="#ccc" variant={BackgroundVariant.Cross} size={1} />
      <Controls />

      <MiniMap nodeStrokeWidth={3} zoomable pannable />
    </ReactFlow>
  );
};

export default FlowMonitor;
