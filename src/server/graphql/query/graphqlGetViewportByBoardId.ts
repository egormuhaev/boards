import { useEffect } from "react";
import { useReactFlow } from "reactflow";
import { useQuery, gql } from "@apollo/client";

const GET_VIEWPORT = gql`
  query Viewports {
    viewports(
      where: { board: { id: { equals: "clxlirvxg0000ru4lc4sevksl" } } }
    ) {
      id
      data
    }
  }
`;

export function graphqlGetViewportByBoardId(boardId?: string) {
  const {
    loading: loadingGetViewport,
    error: errorGetViewport,
    data: dataGetViewport,
  } = useQuery(GET_VIEWPORT, {
    variables: {
      id: boardId,
    },
  });
  const { setViewport } = useReactFlow();
  useEffect(() => {
    if (!loadingGetViewport && !errorGetViewport) {
      setViewport(dataGetViewport.viewports[0].data);
    }
  }, [loadingGetViewport, errorGetViewport, dataGetViewport]);
}
