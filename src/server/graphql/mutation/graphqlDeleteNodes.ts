import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";

const DELETE_NODE = gql`
  mutation DeleteNode($where: NodeWhereUniqueInput!) {
    deleteNode(where: $where) {
      id
    }
  }
`;

export function graphqlDeleteNodes() {
  const [mutateFunction, { data, loading, error }] = useMutation(DELETE_NODE);

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  });

  return { deleteNodeFunction: mutateFunction };
}
