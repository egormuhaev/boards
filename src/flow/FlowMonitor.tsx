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
    // We add a new edge based on the selected DEFAULT_ALGORITHM
    // and transfer all the control points from the connectionLinePath
    // in case the user has added any while creating the connection
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
              id: v4(),
              prev:
                i === 0 ? undefined : playgroundState.connectionLinePath[i - 1],
              active: true,
            }) as ControlPointData,
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
      onEdgesChange={onEdgesChange}
      nodeTypes={playgroundState.nodeTypes}
      edgeTypes={playgroundState.edgeTypes}
      connectionMode={ConnectionMode.Loose}
      maxZoom={200}
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
