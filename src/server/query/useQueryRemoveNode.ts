import { $flow } from "@/flow/store/flow.slice";
import { useUnit } from "effector-react";
import { graphqlDeleteNodes } from "../graphql/mutation/graphqlDeleteNodes";

export function useQueryRemoveNode() {
  const { nodesIdMap } = useUnit($flow);
  const { deleteNodeFunction } = graphqlDeleteNodes();

  const query = (ids: string[]) => {
    for (let i = 0; i < ids.length; i++) {
      const targetId = ids[i];
      const naturalIdNode = nodesIdMap[targetId];

      deleteNodeFunction({
        variables: {
          where: {
            id: naturalIdNode,
          },
        },
      });
    }
  };

  return query;
}
