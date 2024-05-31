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
} from "reactflow";
import {
  $boardPlayground,
  changeNode,
  changeEdge,
  addNewNode,
} from "./store/playground.slice";
import { $flow } from "./store/flow.slice";
import { useUnit } from "effector-react";
import FlowHeadToolbar from "./FlowHeadToolbar";
import FlowHeadParamsNode from "./FlowHeadParamsNode";

const FlowMonitor = () => {
  const playgroundState = useUnit($boardPlayground);
  const flowState = useUnit($flow);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = (changes: NodeChange[]) => {
    if (!flowState.isDrawingMode) {
      return changeNode(applyNodeChanges(changes, playgroundState.nodes));
    }
  };

  const onEdgesChanges = (changes: EdgeChange[]) => {
    if (!flowState.isDrawingMode) {
      changeEdge(applyEdgeChanges(changes, playgroundState.edges));
    }
  };

  const onConnect = (connection: Connection) => {
    changeEdge(addEdge(connection, playgroundState.edges));
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

  return (
    <ReactFlow
      onContextMenu={(e: any) => {
        e.preventDefault();
      }}
      onClick={addNewItemPlaygroud}
      selectionOnDrag
      panOnScroll
      edges={playgroundState.edges}
      nodes={playgroundState.nodes}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChanges}
      nodeTypes={playgroundState.nodeTypes}
      maxZoom={200}
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
