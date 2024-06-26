import { $flow, setNodesIdMap } from "@/flow/store/flow.slice";
import { graphqlCreateNewNode } from "../../graphql/mutation/graphqlCreateNewNode";
import { useUnit } from "effector-react";
import { useEffect } from "react";
import { Node } from "reactflow";

export function useCreateNewNodeServer() {
  const { targetBoard, nodesIdMap } = useUnit($flow);
  const { mutateFunction, data } = graphqlCreateNewNode(targetBoard);

  useEffect(() => {
    if (data) {
      if (data.id && data.nodeId) {
        let newNodesIdMap = { ...nodesIdMap, [data.nodeId]: data.id };
        console.log(newNodesIdMap);
        setNodesIdMap(newNodesIdMap);
      }
    }
  }, [data]);

  const createNewNode = (node: Node<any>) => {
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
  };

  return createNewNode;
}
