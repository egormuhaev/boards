import { gql, useMutation } from "@apollo/client";
import { Node } from "reactflow";

const CREATE_NODE = gql`
  mutation CreateNode($data: NodeCreateInput!) {
    createNode(data: $data) {
      id
      nodeId
      board {
        id
        name
      }
    }
  }
`;

export function graphqlCreateNewNode(boardId: string, node?: Node<any>) {
  const [mutateFunction, { data, loading, error }] = useMutation(CREATE_NODE, {
    variables: node
      ? {
          data: {
            nodeId: node.id,
            data: node,
            board: {
              connect: {
                id: boardId,
              },
            },
          },
        }
      : undefined,
  });

  return { mutateFunction, data, loading, error };
}
