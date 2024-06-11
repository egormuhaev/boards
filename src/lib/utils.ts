import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Node, NodePositionChange, XYPosition } from "reactflow";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type GetHelperLinesResult = {
  horizontal?: number;
  vertical?: number;
  snapPosition: Partial<XYPosition>;
};

export function getHelperLines(
  change: NodePositionChange,
  nodes: Node[],
  distance = 5
): GetHelperLinesResult {
  const defaultResult = {
    horizontal: undefined,
    vertical: undefined,
    snapPosition: { x: undefined, y: undefined },
  };
  const nodeA = nodes.find((node) => node.id === change.id);

  if (!nodeA || !change.position) {
    return defaultResult;
  }

  const nodeABounds = {
    left: change.position.x,
    right: change.position.x + (nodeA.width ?? 0),
    top: change.position.y,
    bottom: change.position.y + (nodeA.height ?? 0),
    width: nodeA.width ?? 0,
    height: nodeA.height ?? 0,
  };

  let horizontalDistance = distance;
  let verticalDistance = distance;

  return nodes
    .filter((node) => node.id !== nodeA.id)
    .reduce<GetHelperLinesResult>((result, nodeB) => {
      const nodeBBounds = {
        left: nodeB.position.x,
        right: nodeB.position.x + (nodeB.width ?? 0),
        top: nodeB.position.y,
        bottom: nodeB.position.y + (nodeB.height ?? 0),
        width: nodeB.width ?? 0,
        height: nodeB.height ?? 0,
      };

      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |
      //  |___________|
      //  |
      //  |
      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     B     |
      //  |___________|
      const distanceLeftLeft = Math.abs(nodeABounds.left - nodeBBounds.left);

      if (distanceLeftLeft < verticalDistance) {
        result.snapPosition.x = nodeBBounds.left;
        result.vertical = nodeBBounds.left;
        verticalDistance = distanceLeftLeft;
      }

      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |
      //  |___________|
      //              |
      //              |
      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     B     |
      //  |___________|
      const distanceRightRight = Math.abs(
        nodeABounds.right - nodeBBounds.right
      );

      if (distanceRightRight < verticalDistance) {
        result.snapPosition.x = nodeBBounds.right - nodeABounds.width;
        result.vertical = nodeBBounds.right;
        verticalDistance = distanceRightRight;
      }

      //              |‾‾‾‾‾‾‾‾‾‾‾|
      //              |     A     |
      //              |___________|
      //              |
      //              |
      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     B     |
      //  |___________|
      const distanceLeftRight = Math.abs(nodeABounds.left - nodeBBounds.right);

      if (distanceLeftRight < verticalDistance) {
        result.snapPosition.x = nodeBBounds.right;
        result.vertical = nodeBBounds.right;
        verticalDistance = distanceLeftRight;
      }

      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |
      //  |___________|
      //              |
      //              |
      //              |‾‾‾‾‾‾‾‾‾‾‾|
      //              |     B     |
      //              |___________|
      const distanceRightLeft = Math.abs(nodeABounds.right - nodeBBounds.left);

      if (distanceRightLeft < verticalDistance) {
        result.snapPosition.x = nodeBBounds.left - nodeABounds.width;
        result.vertical = nodeBBounds.left;
        verticalDistance = distanceRightLeft;
      }

      //  |‾‾‾‾‾‾‾‾‾‾‾|‾‾‾‾‾|‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |     |     B     |
      //  |___________|     |___________|
      const distanceTopTop = Math.abs(nodeABounds.top - nodeBBounds.top);

      if (distanceTopTop < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.top;
        result.horizontal = nodeBBounds.top;
        horizontalDistance = distanceTopTop;
      }

      //  |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |
      //  |___________|_________________
      //                    |           |
      //                    |     B     |
      //                    |___________|
      const distanceBottomTop = Math.abs(nodeABounds.bottom - nodeBBounds.top);

      if (distanceBottomTop < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.top - nodeABounds.height;
        result.horizontal = nodeBBounds.top;
        horizontalDistance = distanceBottomTop;
      }

      //  |‾‾‾‾‾‾‾‾‾‾‾|     |‾‾‾‾‾‾‾‾‾‾‾|
      //  |     A     |     |     B     |
      //  |___________|_____|___________|
      const distanceBottomBottom = Math.abs(
        nodeABounds.bottom - nodeBBounds.bottom
      );

      if (distanceBottomBottom < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.bottom - nodeABounds.height;
        result.horizontal = nodeBBounds.bottom;
        horizontalDistance = distanceBottomBottom;
      }

      //                    |‾‾‾‾‾‾‾‾‾‾‾|
      //                    |     B     |
      //                    |           |
      //  |‾‾‾‾‾‾‾‾‾‾‾|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
      //  |     A     |
      //  |___________|
      const distanceTopBottom = Math.abs(nodeABounds.top - nodeBBounds.bottom);

      if (distanceTopBottom < horizontalDistance) {
        result.snapPosition.y = nodeBBounds.bottom;
        result.horizontal = nodeBBounds.bottom;
        horizontalDistance = distanceTopBottom;
      }

      return result;
    }, defaultResult);
}
