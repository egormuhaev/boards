import { $flow } from "@/flow/store/flow.slice";
import { graphqlCreateEdge } from "../../graphql/mutation/graphqlCreateEdge";
import { useUnit } from "effector-react";
import { Edge } from "reactflow";

export function useCreateNewEdges() {
  const { targetBoard } = useUnit($flow);
  const { mutateFunction } = graphqlCreateEdge(targetBoard);

  const createNewEdge = (edge: Edge<any>) => {
    mutateFunction({
      variables: {
        data: {
          edgeId: edge.id,
          data: edge,
          board: {
            connect: {
              id: targetBoard,
            },
          },
        },
      },
    });
  };

  return createNewEdge;
}
