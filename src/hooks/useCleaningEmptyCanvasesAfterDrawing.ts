import { useReactFlow, Node } from "reactflow";

type IConditions = Record<string, (node: Node) => boolean>;

const conditions: IConditions = {
  noPointsInObject: (node: Node) =>
    node.type === "drawing" && node.data.points === undefined,

  numberPointsIsLessThanMinimum: (node: Node) => {
    let mininumNumberPoints = 5;
    return (
      node.type === "drawing" && node.data.points?.length < mininumNumberPoints
    );
  },

  sizeOfTheContainerIsInfinite: (node: Node) =>
    node.data.plotSize.width === -Infinity ||
    node.data.plotSize.height === -Infinity,
};

function nodeValidation(node: Node) {
  const conditionsKeys = Object.keys(conditions);
  for (let i = 0; i < conditionsKeys.length; i++) {
    const result = conditions[conditionsKeys[i]](node);

    if (result) {
      return false;
    }
  }

  return true;
}

export function useCleaningEmptyCanvasesAfterDrawing() {
  const { setNodes } = useReactFlow();

  return () => {
    setNodes((nodes: Node[]) => {
      const nodesAfterFilter = nodes.filter((node: Node) =>
        nodeValidation(node),
      );
      return nodesAfterFilter;
    });
  };
}
