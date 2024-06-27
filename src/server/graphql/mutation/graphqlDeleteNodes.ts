import { gql, useMutation } from "@apollo/client";

const DELETE_NODE = gql`
  mutation DeleteNode($where: NodeWhereUniqueInput!) {
    deleteNode(where: $where) {
      id
    }
  }
`;

export function graphqlDeleteNodes() {
  const [mutateFunction, { data, loading, error }] = useMutation(DELETE_NODE);

  return { deleteNodeFunction: mutateFunction };
}
