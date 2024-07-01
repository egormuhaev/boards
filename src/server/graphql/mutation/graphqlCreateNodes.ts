import { gql, useMutation } from "@apollo/client";
import { Node } from "reactflow";

const CREATE_NODES = gql`
  mutation CreateNodes($data: [NodeCreateInput!]!) {
    createNodes(data: $data) {
      nodeId
      id
    }
  }
`;

export function graphqlCreateNodes(boardId: string, node?: Node<any>) {
  const [mutateFunction, { data, error, loading }] = useMutation(CREATE_NODES);

  return { mutateFunction, data, error, loading };
}
