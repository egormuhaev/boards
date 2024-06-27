import { gql, useMutation } from "@apollo/client";

const UPDATE_EDGES = gql`
  mutation UpdateEdge($where: EdgeWhereUniqueInput!, $data: EdgeUpdateInput!) {
    updateEdge(where: $where, data: $data) {
      data
    }
  }
`;

export function graphqlUpdateEdges() {
  const [updateEdgesDataFunction, { data, error, loading }] =
    useMutation(UPDATE_EDGES);

  return { updateEdgesDataFunction };
}
