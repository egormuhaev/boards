import { $flow, setEdgesIdMap } from "@/flow/store/flow.slice";
import { graphqlCreateEdge } from "../../graphql/mutation/graphqlCreateEdge";
import { useUnit } from "effector-react";
import { Edge } from "reactflow";
import { useEffect } from "react";

export function useCreateNewEdges() {
  const { targetBoard, edgesIdMap } = useUnit($flow);
  const { mutateFunction, data } = graphqlCreateEdge(targetBoard);

  useEffect(() => {
    if (data) {
      let edgeId = data.createEdge.edgeId;
      let edgeNaturalId = data.createEdge.id;
      console.log(edgeId);
      console.log(edgeNaturalId);

      if (edgeId && edgeNaturalId) {
        let newEdgesIdMap = { ...edgesIdMap, [edgeId]: edgeNaturalId };

        setEdgesIdMap(newEdgesIdMap);
        console.log(newEdgesIdMap);
      }
    }
  }, [data]);

  const createNewEdge = (edge: Edge<any>) => {
    mutateFunction({
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

  return createNewEdge;
}
