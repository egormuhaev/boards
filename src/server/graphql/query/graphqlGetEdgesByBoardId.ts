import { useEffect } from "react";
import { useReactFlow } from "reactflow";
import { useQuery, gql } from "@apollo/client";
import { setEdgesIdMap } from "@/flow/store/flow.slice";

const GET_EDGES = gql`
  query Edges {
    edges(where: { board: { id: { equals: "clxlirvxg0000ru4lc4sevksl" } } }) {
      id
      data
    }
  }
`;

export function graphqlGetEdgesByBoardId(boardId?: string) {
  const {
    loading: loadingGetEdges,
    error: errorGetEdges,
    data: dataGetEdges,
  } = useQuery(GET_EDGES, {
    variables: {
      id: boardId,
    },
  });
  const { setEdges } = useReactFlow();

  useEffect(() => {
    if (!loadingGetEdges && !errorGetEdges) {
      setEdges(
        dataGetEdges.edges.map((item: any) => {
          return { ...item.data, selected: false };
        }),
      );

      let map: Record<string, string> = {};

      for (let i = 0; i < dataGetEdges.edges.length; i++) {
        let nodeID = dataGetEdges.edges[i].data.id as unknown as any;
        map[nodeID] = dataGetEdges.edges[i].id;
      }

      setEdgesIdMap({ ...map });
    }
  }, [loadingGetEdges, errorGetEdges, dataGetEdges]);
}
