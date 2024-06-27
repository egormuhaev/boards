import { gql, useMutation } from "@apollo/client";

const DELETE_EDGE = gql`
  mutation DeleteEdge($where: EdgeWhereUniqueInput!) {
    deleteEdge(where: $where) {
      id
    }
  }
`;

export function graphqlDeleteEdges() {
  const [mutateFunction, { data, loading, error }] = useMutation(DELETE_EDGE);

  return { deleteEdgeFunction: mutateFunction };
}
