import { useCallback } from "react";
import {
  NodeDragHandler,
  OnEdgesDelete,
  OnNodesDelete,
  SelectionDragHandler,
} from "reactflow";
import useUndoRedo from "./useUndoRedo";

const useEvents = () => {
  const { takeSnapshot } = useUndoRedo();

  const onNodeDragStart: NodeDragHandler = useCallback(() => {
    console.log("Flow was saved: drag start");
    takeSnapshot();
  }, [takeSnapshot]);

  const onNodeDragStop: NodeDragHandler = useCallback(() => {
    console.log("Flow was saved: drag stop");
  }, []);

  const onSelectionDragStart: SelectionDragHandler = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const onNodesDelete: OnNodesDelete = useCallback(() => {
    console.log("Flow was saved: node delete");
    takeSnapshot();
  }, [takeSnapshot]);

  const onEdgesDelete: OnEdgesDelete = useCallback(() => {
    console.log("Flow was saved: edge delete");
    takeSnapshot();
  }, [takeSnapshot]);

  return {
    onNodeDragStart,
    onNodeDragStop,
    onSelectionDragStart,
    onNodesDelete,
    onEdgesDelete,
  };
};

export default useEvents;
