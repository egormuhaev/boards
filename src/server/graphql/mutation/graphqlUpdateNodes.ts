import { gql, useMutation } from "@apollo/client";

const UPDATE_NODE = gql`
  mutation UpdateNode($where: NodeWhereUniqueInput!, $data: NodeUpdateInput!) {
    updateNode(where: $where, data: $data) {
      data
    }
  }
`;

export function graphqlUpdateNodes() {
  const [updateNodeDataFunction, { data, error, loading }] =
    useMutation(UPDATE_NODE);

  return { updateNodeDataFunction };
}
