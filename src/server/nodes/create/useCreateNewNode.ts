import { $flow, setNodesIdMap } from "@/flow/store/flow.slice";
import { graphqlCreateNewNode } from "../../graphql/mutation/graphqlCreateNewNode";
import { useUnit } from "effector-react";
import { useCallback, useEffect } from "react";
import { Node } from "reactflow";

export function useCreateNewNodeServer() {
  const { targetBoard, nodesIdMap } = useUnit($flow);
  const { mutateFunction, data } = graphqlCreateNewNode(targetBoard);

  useEffect(() => {
    if (data) {
      let nodeId = data.createNode.nodeId;
      let nodeNaturalId = data.createNode.id;

      if (nodeId && nodeNaturalId) {
        let newNodesIdMap = { ...nodesIdMap, [nodeId]: nodeNaturalId };

        setNodesIdMap(newNodesIdMap);
      }
    }
  }, [data]);

  const createNewNode = useCallback((node: Node<any>) => {
    mutateFunction({
      variables: {
        data: {
          nodeId: node.id,
          data: node,
          board: {
            connect: {
              id: targetBoard,
            },
          },
        },
      },
    });
  }, []);

  return createNewNode;
}
