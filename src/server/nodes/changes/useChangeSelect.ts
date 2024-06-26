import { useEffect, useState } from "react";
import { NodeSelectionChange } from "reactflow";
import { useSendingModifiedNodeValues } from "@/server/query/useSendingModifiedNodeValues";

export function useChangeSelect() {
  const [heap, setHeap] = useState<NodeSelectionChange[]>([]);
  const query = useSendingModifiedNodeValues();

  useEffect(() => {
    if (heap.length !== 0) {
      let nodesWithCompletedSelect = heap.map((item) => item.id);
      if (nodesWithCompletedSelect.length > 0) {
        query(nodesWithCompletedSelect);
        setHeap([]);
      }
    }
  }, [heap]);

  const setHeep = (change: NodeSelectionChange[]) => {
    if (change.length === 0) {
      return;
    }

    setHeap([...heap, ...change]);
  };

  return { setHeep };
}
