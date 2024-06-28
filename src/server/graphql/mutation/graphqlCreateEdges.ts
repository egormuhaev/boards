import { gql, useMutation } from "@apollo/client";
import { Edge } from "reactflow";

const CREATE_EDGES = gql`
  mutation CreateEdges($data: [EdgeCreateInput!]!) {
    createEdges(data: $data) {
      edgeId
      id
    }
  }
`;

export function graphqlCreateEdges(boardId: string, edge?: Edge<any>) {
  const [mutateFunction, { data, error, loading }] = useMutation(CREATE_EDGES);

  return { mutateFunction, data, error, loading };
}
