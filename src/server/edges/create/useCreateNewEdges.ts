import { $flow, setEdgesIdMap } from "@/flow/store/flow.slice";
import { graphqlCreateEdge } from "../../graphql/mutation/graphqlCreateEdge";
import { useUnit } from "effector-react";
import { Edge } from "reactflow";
import { useEffect } from "react";
import { graphqlCreateEdges } from "@/server/graphql/mutation/graphqlCreateEdges";

export function useCreateNewEdges() {
  const { targetBoard, edgesIdMap } = useUnit($flow);
  const { mutateFunction: mutationCreateEdge, data: dataCreateEdge } =
    graphqlCreateEdge(targetBoard);
  const { mutateFunction: mutationCreateEdges, data: dataCreateEdges } =
    graphqlCreateEdges(targetBoard);

  useEffect(() => {
    let localEdgesIdMap: Record<string, string> = {};
    if (dataCreateEdges) {
      dataCreateEdges.createEdges.forEach(
        ({ edgeId, id }: { edgeId: string; id: string }) => {
          if (edgeId && id) {
            localEdgesIdMap[edgeId] = id;
          }
        },
      );

      setEdgesIdMap({ ...edgesIdMap, ...localEdgesIdMap });
    }
  }, [dataCreateEdges]);

  useEffect(() => {
    if (dataCreateEdge) {
      let { edgeId, id } = dataCreateEdge.createEdge;
      if (edgeId && id) {
        let newEdgesIdMap = { ...edgesIdMap, [edgeId]: id };
        setEdgesIdMap(newEdgesIdMap);
      }
    }
  }, [dataCreateEdge]);

  const createNewEdge = async (edge: Edge<any>) => {
    mutationCreateEdge({
      variables: {
        data: {
          edgeId: edge.id,
          data: edge,
          board: {
            connect: {
              id: targetBoard,
            },
          },
        },
      },
    });
  };

  const createNewEdges = async (edges: Edge<any>[]) => {
    let queryData = edges.map((item) => ({
      edgeId: item.id,
      data: { ...item },
      board: {
        connect: {
          id: targetBoard,
        },
      },
    }));

    mutationCreateEdges({
      variables: {
        data: [...queryData],
      },
    });
  };

  return { createNewEdges, createNewEdge };
}
