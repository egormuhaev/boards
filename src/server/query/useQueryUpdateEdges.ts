import { $flow } from "@/flow/store/flow.slice";
import { useUnit } from "effector-react";
import { Edge } from "reactflow";
import { graphqlUpdateEdges } from "../graphql/mutation/graphqlUpdateEdges";

export function useQueryUpdateEdges() {
  const { edgesIdMap } = useUnit($flow);
  const { updateEdgesDataFunction } = graphqlUpdateEdges();

  const query = async (edges: Edge[]) => {
    for (let i = 0; i < edges.length; i++) {
      const targetId = edges[i].id;
      const naturalIdEdge = edgesIdMap[targetId];
      const edgeCurrentState = edges[i];

      updateEdgesDataFunction({
        variables: {
          where: {
            id: naturalIdEdge,
          },
          data: {
            data: { ...edgeCurrentState },
          },
        },
      });
    }
  };

  return query;
}
