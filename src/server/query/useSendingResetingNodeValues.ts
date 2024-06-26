import { $flow } from "@/flow/store/flow.slice";
import { graphqlUpdateNodes } from "../graphql/mutation/graphqlUpdateNodes";
import { useUnit } from "effector-react";
import { Node } from "reactflow";

export function useSendingResetingNodeValues() {
  const { nodesIdMap } = useUnit($flow);
  const { updateNodeDataFunction } = graphqlUpdateNodes();

  const query = (nodes: Node[]) => {
    for (let i = 0; i < nodes.length; i++) {
      const targetId = nodes[i].id;
      const naturalIdNode = nodesIdMap[targetId];
      const nodeCurrentState = nodes[i];

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
