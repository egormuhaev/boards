import { NodePositionChange } from "reactflow";
import { useQueryUpdateNodesByIds } from "@/server/query/useQueryUpdateNodesByIds";
import { useCallback } from "react";

export function useChangePosition() {
  const query = useQueryUpdateNodesByIds();

  const onChangePosition = useCallback(
    async (heap: NodePositionChange[]) => {
      if (heap.length !== 0) {
        let nodesWithCompletedMovement = [];

        for (let i = 0; i < heap.length; i++) {
          if (heap[i].dragging === false) {
            nodesWithCompletedMovement.push(heap[i].id);
          }
        }

        if (nodesWithCompletedMovement.length > 0) {
          query(nodesWithCompletedMovement);
        }
      }
    },
    [query],
  );

  const setHeep = useCallback(
    async (change: NodePositionChange[]) => {
      const chengeDontHaveCompleteElement = change.filter(
        (item) => item.dragging === false,
      );
      if (chengeDontHaveCompleteElement.length === 0) {
        return;
      }

      onChangePosition(change);
    },
    [onChangePosition],
  );

  return { setHeep };
}
