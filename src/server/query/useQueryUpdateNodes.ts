import { $flow } from "@/flow/store/flow.slice";
import { graphqlUpdateNodes } from "../graphql/mutation/graphqlUpdateNodes";
import { useUnit } from "effector-react";
import { Node } from "reactflow";

export function useQueryUpdateNodes() {
  const { nodesIdMap } = useUnit($flow);
  const { updateNodeDataFunction } = graphqlUpdateNodes();

  const query = async (nodes: Node[]) => {
    for (let i = 0; i < nodes.length; i++) {
      const targetId = nodes[i].id;
      const naturalIdNode = nodesIdMap[targetId];
      const nodeCurrentState = nodes[i];

      if (
        nodeCurrentState.type === "drawing" &&
        nodeCurrentState.data.isCompletedDrawing === false
      ) {
        continue;
      }

      updateNodeDataFunction({
        variables: {
          where: {
            id: naturalIdNode,
          },
          data: {
            data: { ...nodeCurrentState },
          },
        },
      });
    }
  };

  return query;
}