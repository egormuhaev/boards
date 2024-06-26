import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { Edge } from "reactflow";

const CREATE_EDGE = gql`
  mutation CreateEdge($data: EdgeCreateInput!) {
    createEdge(data: $data) {
      id
      edgeId
      board {
        id
      }
    }
  }
`;

export function graphqlCreateEdge(boardId?: string, edge?: Edge<any>) {
  const [mutateFunction, { data, loading, error }] = useMutation(CREATE_EDGE, {
    variables: edge
      ? {
          data: {
            edgeId: edge.id,
            data: edge,
            board: {
              connect: {
                id: boardId,
              },
            },
          },
        }
      : undefined,
  });

  useEffect(() => {
    console.log(error);
  }, [error]);

  return { mutateFunction, data, loading, error };
}
