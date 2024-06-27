import { $flow } from "@/flow/store/flow.slice";
import { graphqlUpdateNodes } from "../graphql/mutation/graphqlUpdateNodes";
import { useUnit } from "effector-react";
import { useReactFlow } from "reactflow";
import { getNodeById } from "../nodes/utils/getNodeById";
import { useCallback } from "react";

export function useQueryUpdateNodesByIds() {
  const { nodesIdMap } = useUnit($flow);
  const { updateNodeDataFunction } = graphqlUpdateNodes();
  const { getNodes } = useReactFlow();

  const query = useCallback(
    async (ids: string[]) => {
      for (let i = 0; i < ids.length; i++) {
        const nodes = getNodes();
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
    },
    [updateNodeDataFunction, nodesIdMap],
  );

  return query;
}
