import { MouseEvent, RefObject, useCallback, useEffect } from "react";
import useCreateNode from "./useCreateNode";
import { useUnit } from "effector-react";
import {
  $boardPlayground,
  clearBufferCreatingType,
} from "@/flow/store/playground.slice";
import { ReactFlowInstance, useNodes } from "reactflow";
import useUndoRedo from "./useUndoRedo";
import { $flow } from "@/flow/store/flow.slice";

const useMouseEvents = (
  reactFlowInstance: ReactFlowInstance | null,
  ref: RefObject<HTMLInputElement>
) => {
  const flowState = useUnit($flow);
  // const nodes = useNodes();
  const { buffer } = useUnit($boardPlayground);
  const { takeSnapshot } = useUndoRedo();

  const {
    addFileNode,
    addDrawingNode,
    addNode,
    activateMoving,
    addNodeOnResize,
    setPosition,
    disactivateMoving,
    isMoving,
  } = useCreateNode(ref);

  const onClick = async (e: MouseEvent<Element>) => {
    if (!buffer?.nodeType || !reactFlowInstance) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    takeSnapshot();

    if (buffer.nodeType === "file") {
      await addFileNode(position);
      clearBufferCreatingType();
    } else if (flowState.isDrawingMode) {
      addDrawingNode(position);
    } else {
      const nodeSize = {
        width: 180,
        height: 180,
      };

      if (!isMoving) {
        addNode(
          { nodeType: buffer.nodeType, subType: buffer.subType },
          position,
          nodeSize
        );
      }

      clearBufferCreatingType();
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
      addNodeOnResize(event);
    },
    [addNodeOnResize]
  );

  return { onClick, onMouseDown, onMouseMove, onMouseUp };
};

export default useMouseEvents;
