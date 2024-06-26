import {
  NodeChange,
  NodeDimensionChange,
  NodePositionChange,
  NodeRemoveChange,
  NodeResetChange,
  NodeSelectionChange,
} from "reactflow";
import { useChangePosition } from "./nodes/changes/useChangePosition";
import { useChangeDimension } from "./nodes/changes/useChangeDimension";
import { useChangeReset } from "./nodes/changes/useChangeReset";
import { useChangeSelect } from "./nodes/changes/useChangeSelect";
import { useUnit } from "effector-react";
import { $flow } from "@/flow/store/flow.slice";
import { useDeleteNodes } from "./nodes/delete/useDeleteNode";

export function useNodesChangeServer() {
  const { setHeep: setHeapPosition } = useChangePosition();
  const { setHeep: setHeapDimension } = useChangeDimension();
  const { setHeep: setHeapReset } = useChangeReset();
  const { setHeep: setHeapSelect } = useChangeSelect();
  const { setHeep: setHeapDelete } = useDeleteNodes();
  const { isDrawingMode } = useUnit($flow);

  return (changes: NodeChange[]) => {
    const { position, remove, dimension, reset, select } =
      classificationOfChangeEvents(changes, isDrawingMode);

    if (select.length > 0) {
      setHeapSelect(select as NodeSelectionChange[]);
    }

    if (remove.length > 0) {
      setHeapDelete(remove as NodeRemoveChange[]);
    }

    if (position.length > 0) {
      setHeapPosition(position as NodePositionChange[]);
    }

    if (dimension.length > 0) {
      setHeapDimension(dimension as NodeDimensionChange[]);
    }

    if (reset.length > 0) {
      setHeapReset(reset as NodeResetChange[]);
    }
  };
}

function classificationOfChangeEvents(
  changes: NodeChange[],
  isDrawingMode: boolean,
) {
  let position = [];
  let dimension = [];
  let reset = [];
  let select = [];
  let remove = [];

  if (!isDrawingMode) {
    for (let i = 0; i < changes.length; i++) {
      switch (changes[i].type) {
        case "remove":
          remove.push(changes[i]);
          break;
        case "position":
          position.push(changes[i]);
          break;
        case "dimensions":
          dimension.push(changes[i]);
          break;
        case "reset": {
          reset.push(changes[i]);
          break;
        }
        case "select":
          select.push(changes[i]);
          break;
        default:
          continue;
      }
    }
  }

  return { position, dimension, reset, select, remove };
}
