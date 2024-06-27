import { $flow } from "@/flow/store/flow.slice";
import { useUnit } from "effector-react";
import { graphqlDeleteEdges } from "../graphql/mutation/graphqlDeleteEdges";

export function useQueryRemoveEdges() {
  const { edgesIdMap } = useUnit($flow);
  const { deleteEdgeFunction } = graphqlDeleteEdges();

  const query = (ids: string[]) => {
    for (let i = 0; i < ids.length; i++) {
      const targetId = ids[i];
      const naturalIdEdge = edgesIdMap[targetId];

      deleteEdgeFunction({
        variables: {
          where: {
            id: naturalIdEdge,
          },
        },
      });
    }
  };

  return query;
}
