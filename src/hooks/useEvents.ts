import { DragEvent, MouseEvent, useCallback, useState } from "react";
import {
  NodeDragHandler,
  OnEdgesDelete,
  OnNodesDelete,
  SelectionDragHandler,
  useReactFlow,
} from "reactflow";
import useUndoRedo from "./useUndoRedo";
import useCreateNode from "./useCreateNode";
import { $flow } from "@/flow/store/flow.slice";
import { useUnit } from "effector-react";

const useEvents = () => {
  const { takeSnapshot } = useUndoRedo();
  const { screenToFlowPosition } = useReactFlow();
  const { addNode } = useCreateNode();
  const { isDrawingMode } = useUnit($flow);

  const onNodeDragStart: NodeDragHandler = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onSelectionDragStart: SelectionDragHandler = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onNodesDelete: OnNodesDelete = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onEdgesDelete: OnEdgesDelete = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const [startPos, setStartPos] = useState<any>();

  const onMouseDown = (event: MouseEvent) => {
    if (isDrawingMode) {
      addNode({ startPosition: startPos });
    } else {
      setStartPos({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const onMouseMove = (event: MouseEvent) => {};

  const onMouseUp = (event: MouseEvent) => {
    if (isDrawingMode) {
      return undefined;
    }
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Внутри логика определения и добавления ноды
    addNode({ startPosition: startPos, endPosition: position });
  };

  const onClick = (event: MouseEvent) => {
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Внутри логика определения и добавления ноды
    addNode({ startPosition: position, endPosition: position });
  };

  const onDrop = (event: DragEvent) => {
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const transferFiles = event.dataTransfer?.files;

    // Внутри логика определения и добавления ноды
    addNode({
      startPosition: position,
      endPosition: position,
      files: transferFiles,
    });
  };

  return {
    onClick,
    onDrop,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onNodeDragStart,
    onSelectionDragStart,
    onNodesDelete,
    onEdgesDelete,
  };
};

export default useEvents;
