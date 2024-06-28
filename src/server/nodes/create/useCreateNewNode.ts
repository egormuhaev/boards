import { $flow, setNodesIdMap } from "@/flow/store/flow.slice";
import { graphqlCreateNewNode } from "../../graphql/mutation/graphqlCreateNewNode";
import { useUnit } from "effector-react";
import { useCallback, useEffect } from "react";
import { Node } from "reactflow";
import { graphqlCreateNodes } from "@/server/graphql/mutation/graphqlCreateNodes";

export function useCreateNewNodeServer() {
  const { targetBoard, nodesIdMap } = useUnit($flow);
  const { mutateFunction: mutatuinCreateNode, data: dataCreateNode } =
    graphqlCreateNewNode(targetBoard);
  const { mutateFunction: mutatuinCreateNodes, data: dataCreateNodes } =
    graphqlCreateNodes(targetBoard);

  useEffect(() => {
    if (dataCreateNode) {
      let nodeId = dataCreateNode.createNode.nodeId;
      let nodeNaturalId = dataCreateNode.createNode.id;

      if (nodeId && nodeNaturalId) {
        let newNodesIdMap = { ...nodesIdMap, [nodeId]: nodeNaturalId };

        setNodesIdMap(newNodesIdMap);
      }
    }
  }, [dataCreateNode]);

  useEffect(() => {
    let localNodesIdMap: Record<string, string> = {};
    if (dataCreateNodes) {
      dataCreateNodes.createNodes.forEach(
        (itam: { nodeId: string; id: string }) => {
          let nodeId = itam.nodeId;
          let nodeNaturalId = itam.id;
          if (nodeId && nodeNaturalId) {
            localNodesIdMap[nodeId] = nodeNaturalId;
          }
        },
      );

      setNodesIdMap({ ...nodesIdMap, ...localNodesIdMap });
    }
  }, [dataCreateNodes]);

  const createNewNodes = useCallback(async (nodes: Node<any>[]) => {
    let queryData = nodes.map((item) => ({
      nodeId: item.id,
      data: { ...item },
      board: {
        connect: {
          id: targetBoard,
        },
      },
    }));

    mutatuinCreateNodes({
      variables: {
        data: [...queryData],
      },
    });
  }, []);

  const createNewNode = useCallback(async (node: Node<any>) => {
    mutatuinCreateNode({
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

  return { createNewNode, createNewNodes };
}
