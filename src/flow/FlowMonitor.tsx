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
  Panel,
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
import React, { DragEvent, useState } from "react";
import { NodeTypes } from "@/components";
import useUndoRedo from "@/hooks/useUndoRedo";
import { Redo, Undo } from "lucide-react";
import { getHelperLines } from "@/lib/utils";
import HelperLines from "@/components/HelperLines";
import useCopyPaste from "@/hooks/useCopyPaste";

const fileTypes: Record<string, NodeTypes> = {
  pdf: NodeTypes.PDFNodeFlowTypes,
  jpeg: NodeTypes.PictureNodeFlowTypes,
  jpg: NodeTypes.PictureNodeFlowTypes,
  png: NodeTypes.PictureNodeFlowTypes,
  mov: NodeTypes.VideoNodeFlowTypes,
  mp4: NodeTypes.VideoNodeFlowTypes,
  webm: NodeTypes.VideoNodeFlowTypes,
};

const FlowMonitor = () => {
  const proOptions = {
    account: 'paid-pro',
    hideAttribution: true,
  };

  const playgroundState = useUnit($boardPlayground);
  const flowState = useUnit($flow);
  const { screenToFlowPosition } = useReactFlow();
  const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();
  useCopyPaste();

  const [helperLineHorizontal, setHelperLineHorizontal] = useState<
    number | undefined
  >(undefined);
  const [helperLineVertical, setHelperLineVertical] = useState<
    number | undefined
  >(undefined);

  const onNodesChange = (changes: NodeChange[]) => {
    if (!flowState.isDrawingMode) {
      setHelperLineHorizontal(undefined);
      setHelperLineVertical(undefined);

      if (
        changes.length === 1 &&
        changes[0].type === "position" &&
        changes[0].dragging &&
        changes[0].position
      ) {
        const helperLines = getHelperLines(changes[0], playgroundState.nodes);

        // if we have a helper line, we snap the node to the helper line position
        // this is being done by manipulating the node position inside the change object
        changes[0].position.x =
          helperLines.snapPosition.x ?? changes[0].position.x;
        changes[0].position.y =
          helperLines.snapPosition.y ?? changes[0].position.y;

        // if helper lines are returned, we set them so that they can be displayed
        setHelperLineHorizontal(helperLines.horizontal);
        setHelperLineVertical(helperLines.vertical);
      }

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

    takeSnapshot();
    changeEdge(addEdge(edge, playgroundState.edges));
  };

  const addNewItemPlaygroud = (e: React.MouseEvent) => {
    if (!flowState.isDrawingMode) {
      if (playgroundState.create !== null) {
        takeSnapshot();
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
    if (!files.length) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);

      const type: NodeTypes =
        fileTypes[fileExtension] ?? NodeTypes.FileNodeFlowTypes;

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY + i * 100,
      });
      takeSnapshot();
      addNewNode({
        data: { file },
        type,
        position,
      });
    }
  };

  return (
    <ReactFlow
      onClick={addNewItemPlaygroud}
      onContextMenu={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onConnect={onConnect}
      onDragOver={handleDragEvent}
      onDragEnter={handleDragEvent}
      onDragLeave={handleDragEvent}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onMoveStart={() => setIsMovementPlayground(true)}
      onMoveEnd={() => setIsMovementPlayground(false)}
      selectionOnDrag
      edges={playgroundState.edges}
      nodes={playgroundState.nodes}
      nodeTypes={playgroundState.nodeTypes}
      edgeTypes={playgroundState.edgeTypes}
      connectionMode={ConnectionMode.Loose}
      minZoom={0.1}
      maxZoom={500}
      connectionLineComponent={ConnectionLine}  
      proOptions={proOptions}
    >
      <Panel
        position="bottom-center"
        className="w-[100px] flex justify-around z-50 gap-5 p-2 bg-white rounded-lg border border-solid-1 border-slate-300"
      >
        <button disabled={canUndo} onClick={undo}>
          <Undo color={!canUndo ? "black" : "#e5e7eb"} />
        </button>
        <button disabled={canRedo} onClick={redo}>
          <Redo color={!canRedo ? "black" : "#e5e7eb"} />
        </button>
      </Panel>

      {playgroundState.create && <FlowHeadParamsNode />}
      <FlowHeadToolbar />
      <Background color="#ccc" variant={BackgroundVariant.Cross} size={1} />
      <Controls />

      <HelperLines
        horizontal={helperLineHorizontal}
        vertical={helperLineVertical}
      />

      <MiniMap nodeStrokeWidth={3} zoomable pannable />
    </ReactFlow>
  );
};

export default FlowMonitor;
