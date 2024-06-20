import { MouseEvent, RefObject, useCallback, useEffect, useState } from "react";
import useCreateNode from "./useCreateNode";
import { useUnit } from "effector-react";
import {
  $boardPlayground,
  clearBufferCreatingType,
} from "@/flow/store/playground.slice";
import { useReactFlow } from "reactflow";
import useUndoRedo from "./useUndoRedo";
import { $flow } from "@/flow/store/flow.slice";

const useMouseEvents = (ref: RefObject<HTMLInputElement>) => {
  const flowState = useUnit($flow);
  const { screenToFlowPosition } = useReactFlow();
  const { buffer } = useUnit($boardPlayground);
  const { takeSnapshot } = useUndoRedo();

  const [isMoving, setIsMoving] = useState(false);
  const [startPosition, setStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const setPosition = useCallback(
    (event: MouseEvent) =>
      setStartPosition({ x: event.clientX, y: event.clientY }),
    []
  );

  const activateMoving = useCallback(() => setIsMoving(true), []);
  const disactivateMoving = useCallback(() => setIsMoving(false), []);

  const { addFileNode, addDrawingNode, addShapeNode, addTextNode } =
    useCreateNode(ref);

  const onClick = async (e: MouseEvent<Element>) => {
    if (!buffer?.nodeType) return;

    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    takeSnapshot();

    if (buffer.nodeType === "file") {
      const nodeSize = {
        width: 500,
        height: 600,
      };

      await addFileNode(position, nodeSize);
    } else if (buffer.nodeType === "text") {
      const nodeSize = {
        width: 180,
        height: 40,
      };

      addTextNode(position, nodeSize);
    } else if (flowState.isDrawingMode) {
      addDrawingNode(position);
    } else {
      const nodeSize = {
        width: 180,
        height: 180,
      };

      if (!isMoving) {
        addShapeNode(
          { nodeType: buffer.nodeType, subType: buffer.subType },
          position,
          nodeSize
        );
      }
    }

    clearBufferCreatingType();
  };

  const addShapeNodeOnResize = (event: MouseEvent) => {
    if (buffer?.nodeType && buffer.subType && isMoving && startPosition) {
      const scaledStartPosition = screenToFlowPosition(startPosition);
      const scaledEndPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const width = Math.abs(scaledEndPosition.x - scaledStartPosition.x);
      const height = Math.abs(scaledEndPosition.y - scaledStartPosition.y);

      const smartStartPosition = {
        x:
          scaledStartPosition.x < scaledEndPosition.x
            ? scaledStartPosition.x
            : scaledEndPosition.x,
        y:
          scaledStartPosition.y < scaledEndPosition.y
            ? scaledStartPosition.y
            : scaledEndPosition.y,
      };

      addShapeNode(
        { nodeType: buffer?.nodeType, subType: buffer.subType },
        smartStartPosition,
        {
          width,
          height,
        }
      );
    }
  };

  const onMouseDown = (event: MouseEvent) => {
    if (flowState.isDrawingMode) {
      return onClick(event);
    } else {
      disactivateMoving();
      setPosition(event);
    }
  };

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!flowState.isDrawingMode) {
        activateMoving();
      }
    },
    [flowState.isDrawingMode]
  );

  const onMouseUp = useCallback(
    (event: MouseEvent) => {
      addShapeNodeOnResize(event);
    },
    [addShapeNodeOnResize]
  );

  return { onClick, onMouseDown, onMouseMove, onMouseUp };
};

export default useMouseEvents;
