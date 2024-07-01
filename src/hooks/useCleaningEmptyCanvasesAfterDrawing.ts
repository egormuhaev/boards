import { $flow } from "@/flow/store/flow.slice";
import { useUnit } from "effector-react";
import { useReactFlow, Node } from "reactflow";

type IConditions = Record<
  string,
  (node: Node, isDrawingNode: boolean) => boolean
>;

const conditions: IConditions = {
  noPointsInObject: (node: Node, isDrawingMode: boolean) =>
    (node.type === "drawing" && node.data.points === undefined) ||
    (node.type === "drawingMobile" && node.data.points === undefined),

  numberPointsIsLessThanMinimum: (node: Node, isDrawingMode: boolean) => {
    let mininumNumberPoints = 5;
    return (
      (node.type === "drawing" &&
        node.data.points?.length < mininumNumberPoints) ||
      (node.type === "drawingMobile" &&
        node.data.points?.length < mininumNumberPoints)
    );
  },

  sizeOfTheContainerIsInfinite: (node: Node, isDrawingMode: boolean) =>
    node.type === "drawing" &&
    (node.data.plotSize.width === -Infinity ||
      node.data.plotSize.height === -Infinity),

  noCompleteDraving: (node: Node, isDrawingMode: boolean) =>
    (node.type === "drawing" && !node.data.isCompletedDrawing) ||
    (node.type === "drawingMobile" && !node.data.isCompletedDrawing),
};

function nodeValidation(node: Node, isDrawingMode: boolean) {
  const conditionsKeys = Object.keys(conditions);
  for (let i = 0; i < conditionsKeys.length; i++) {
    const result = conditions[conditionsKeys[i]](node, isDrawingMode);
    if (result) {
      return false;
    }
  }

  return true;
}

export function useCleaningEmptyCanvasesAfterDrawing() {
  const { setNodes } = useReactFlow();
  const { isDrawingMode } = useUnit($flow);

  return () => {
    setNodes((nodes: Node[]) => {
      const nodesAfterFilter = nodes.filter((node: Node) =>
        nodeValidation(node, isDrawingMode),
      );
      return nodesAfterFilter;
    });
  };
}
