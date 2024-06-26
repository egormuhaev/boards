import { useEffect, useState } from "react";
import { NodeResetChange } from "reactflow";
import { useSendingResetingNodeValues } from "@/server/query/useSendingResetingNodeValues";

export function useChangeReset() {
  const [heap, setHeap] = useState<NodeResetChange[]>([]);
  const query = useSendingResetingNodeValues();

  useEffect(() => {
    console.log("useChangeReset");
    if (heap.length !== 0) {
      let nodesWithCompletedReset = heap.map((item) => item.item);
      if (nodesWithCompletedReset.length > 0) {
        query(nodesWithCompletedReset);

        setHeap([]);
      }
    }
  }, [heap]);

  const setHeep = (change: NodeResetChange[]) => {
    if (change.length === 0) {
      return;
    }
    setHeap([...change]);
  };

  return { setHeep };
}
