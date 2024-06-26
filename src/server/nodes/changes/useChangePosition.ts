import { useEffect, useState } from "react";
import { NodePositionChange } from "reactflow";
import { useSendingModifiedNodeValues } from "@/server/query/useSendingModifiedNodeValues";

export function useChangePosition() {
  const [heap, setHeap] = useState<NodePositionChange[]>([]);
  const query = useSendingModifiedNodeValues();

  useEffect(() => {
    console.log("useChangePosition");
    if (heap.length !== 0) {
      let nodesWithCompletedMovement = [];

      for (let i = 0; i < heap.length; i++) {
        if (heap[i].dragging === false) {
          nodesWithCompletedMovement.push(heap[i].id);
        }
      }

      if (nodesWithCompletedMovement.length > 0) {
        query(nodesWithCompletedMovement);

        setHeap([
          ...heap.filter(
            (item) => !nodesWithCompletedMovement.includes(item.id),
          ),
        ]);
      }
    }
  }, [heap]);

  const setHeep = (change: NodePositionChange[]) => {
    const chengeDontHaveCompleteElement = change.filter(
      (item) => item.dragging === false,
    );
    if (chengeDontHaveCompleteElement.length === 0) {
      return;
    }

    setHeap([...heap, ...change]);
  };

  return { setHeep };
}
