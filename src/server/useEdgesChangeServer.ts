import { EdgeChange, EdgeRemoveChange, EdgeResetChange } from "reactflow";
import { useUnit } from "effector-react";
import { $flow } from "@/flow/store/flow.slice";
import { useCallback } from "react";
import { useChangeEdgesReset } from "./edges/changes/useChangeReset";
import { useDeleteEdges } from "./edges/delete/useDeleteEdges";

export function useEdgesChangeServer() {
  const { setHeep: setHeapReset } = useChangeEdgesReset();
  const { setHeep: setHeapDelete } = useDeleteEdges();
  // const { setHeep: setHeapPosition } = useChangePosition();
  // const { setHeep: setHeapDimension } = useChangeDimension();
  // const { setHeep: setHeapReset } = useChangeReset();
  // const { setHeep: setHeapSelect } = useChangeSelect();
  // const { setHeep: setHeapDelete } = useDeleteNodes();
  const { isDrawingMode } = useUnit($flow);

  const eventProcessing = useCallback(
    async (changes: EdgeChange[]) => {
      const { remove, reset, select } = classificationOfChangeEvents(
        changes,
        isDrawingMode,
      );

      if (reset.length > 0) {
        setHeapReset(reset as EdgeResetChange[]);
      }
      if (remove.length > 0) {
        setHeapDelete(remove as EdgeRemoveChange[]);
      }
    },
    [isDrawingMode, setHeapReset],
  );

  return eventProcessing;
}

function classificationOfChangeEvents(
  changes: EdgeChange[],
  isDrawingMode: boolean,
) {
  let reset = [];
  let select = [];
  let remove = [];

  if (!isDrawingMode) {
    for (let i = 0; i < changes.length; i++) {
      switch (changes[i].type) {
        case "remove":
          remove.push(changes[i]);
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

  return { reset, select, remove };
}
