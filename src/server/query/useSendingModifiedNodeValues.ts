import { $flow } from "@/flow/store/flow.slice";
import { graphqlUpdateNodes } from "../graphql/mutation/graphqlUpdateNodes";
import { useUnit } from "effector-react";
import { useNodes } from "reactflow";
import { getNodeById } from "../nodes/utils/getNodeById";

export function useSendingModifiedNodeValues() {
  const { nodesIdMap } = useUnit($flow);
  const { updateNodeDataFunction } = graphqlUpdateNodes();
  const nodes = useNodes();

  const query = (ids: string[]) => {
    for (let i = 0; i < ids.length; i++) {
      const targetId = ids[i];
      const naturalIdNode = nodesIdMap[targetId];
      const nodeCurrentState = getNodeById(targetId, nodes);
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
