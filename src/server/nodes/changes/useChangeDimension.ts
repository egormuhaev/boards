import { useEffect, useState } from "react";
import { NodeDimensionChange } from "reactflow";
import { useSendingModifiedNodeValues } from "@/server/query/useSendingModifiedNodeValues";

export function useChangeDimension() {
  const [heap, setHeap] = useState<NodeDimensionChange[]>([]);
  const query = useSendingModifiedNodeValues();

  useEffect(() => {
    if (heap.length !== 0) {
      let nodesWithCompletedResize = [];
      for (let i = 0; i < heap.length; i++) {
        if (heap[i].resizing === false) {
          nodesWithCompletedResize.push(heap[i].id);
        }
      }

      if (nodesWithCompletedResize.length > 0) {
        query(nodesWithCompletedResize);
        setHeap([
          ...heap.filter((item) => !nodesWithCompletedResize.includes(item.id)),
        ]);
      }
    }
  }, [heap]);

  const setHeep = (change: NodeDimensionChange[]) => {
    const chengeDontHaveCompleteElement = change.filter(
      (item) => item.resizing === false,
    );
    if (chengeDontHaveCompleteElement.length === 0) {
      return;
    }

    setHeap([...heap, ...change]);
  };

  return { setHeep };
}
