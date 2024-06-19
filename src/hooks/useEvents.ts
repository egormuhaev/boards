import { useCallback, useEffect } from "react";
import {
  NodeDragHandler,
  OnEdgesDelete,
  OnNodesDelete,
  SelectionDragHandler,
} from "reactflow";
import useUndoRedo from "./useUndoRedo";

const useEvents = () => {
  const { takeSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo();

  useEffect(() => {
    console.log("change redo undo use events");
  }, [undo, redo, canUndo, canRedo, takeSnapshot]);

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

  return {
    onNodeDragStart,
    onSelectionDragStart,
    onNodesDelete,
    onEdgesDelete,
  };
};

export default useEvents;
