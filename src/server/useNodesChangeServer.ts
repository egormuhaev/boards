import {
  NodeChange,
  NodeDimensionChange,
  NodePositionChange,
  NodeResetChange,
  NodeSelectionChange,
} from "reactflow";
import { useChangePosition } from "./nodes/changes/useChangePosition";
import { useChangeDimension } from "./nodes/changes/useChangeDimension";
import { useChangeReset } from "./nodes/changes/useChangeReset";
import { useChangeSelect } from "./nodes/changes/useChangeSelect";

export function useNodesChangeServer() {
  const { setHeep: setHeapPosition } = useChangePosition();
  const { setHeep: setHeapDimension } = useChangeDimension();
  const { setHeep: setHeapReset } = useChangeReset();
  const { setHeep: setHeapSelect } = useChangeSelect();

  return (changes: NodeChange[]) => {
    const { position, dimension, reset, select } =
      classificationOfChangeEvents(changes);

    if (select.length > 0) {
      setHeapSelect(select as NodeSelectionChange[]);
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

function classificationOfChangeEvents(changes: NodeChange[]) {
  let position = [];
  let dimension = [];
  let reset = [];
  let select = [];

  for (let i = 0; i < changes.length; i++) {
    switch (changes[i].type) {
      case "position":
        position.push(changes[i]);
        break;
      case "dimensions":
        dimension.push(changes[i]);
        break;
      case "reset":
        reset.push(changes[i]);
        break;
      case "select":
        select.push(changes[i]);
        break;
      default:
        continue;
    }
  }

  return { position, dimension, reset, select };
}
