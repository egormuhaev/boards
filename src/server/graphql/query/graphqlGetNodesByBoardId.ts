import { useEffect } from "react";
import { useReactFlow } from "reactflow";
import { useQuery, gql } from "@apollo/client";
import { setNodesIdMap } from "@/flow/store/flow.slice";

const GET_NODES = gql`
  query Nodes {
    nodes(where: { board: { id: { equals: "clxlirvxg0000ru4lc4sevksl" } } }) {
      id
      data
    }
  }
`;

export function graphqlGetNodesByBoardId(boardId?: string) {
  const {
    loading: loadingGetNodes,
    error: errorGetNodes,
    data: dataGetNodes,
  } = useQuery(GET_NODES, {
    variables: {
      id: boardId,
    },
  });
  const { setNodes } = useReactFlow();
  useEffect(() => {
    if (!loadingGetNodes && !errorGetNodes) {
      let map: Record<string, string> = {};

      for (let i = 0; i < dataGetNodes.nodes.length; i++) {
        let nodeID = dataGetNodes.nodes[i].data.id as unknown as any;
        map[nodeID] = dataGetNodes.nodes[i].id;
      }

      setNodesIdMap({ ...map });
      setNodes(
        dataGetNodes.nodes.map((item: any) => {
          return { ...item.data, selected: false };
        }),
      );
    }
  }, [loadingGetNodes, errorGetNodes, dataGetNodes]);
}
