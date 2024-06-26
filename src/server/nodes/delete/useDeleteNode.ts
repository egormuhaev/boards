import { useEffect, useState } from "react";
import { NodeRemoveChange } from "reactflow";
import { useRemoveNode } from "@/server/query/useRemoveNode";

export function useDeleteNodes() {
  const [heap, setHeap] = useState<NodeRemoveChange[]>([]);
  const query = useRemoveNode();

  useEffect(() => {
    console.log("useDeleteNode");
    if (heap.length !== 0) {
      let nodesWithCompletedReset = heap.map((item) => item.id);
      if (nodesWithCompletedReset.length > 0) {
        query(nodesWithCompletedReset);
        setHeap([]);
      }
    }
  }, [heap]);

  const setHeep = (change: NodeRemoveChange[]) => {
    if (change.length === 0) {
      return;
    }
    setHeap([...change]);
  };

  return { setHeep };
}
