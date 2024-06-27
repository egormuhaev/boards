import { NodeRemoveChange } from "reactflow";
import { useQueryRemoveNode } from "@/server/query/useQueryRemoveNode";

export function useDeleteNodes() {
  const query = useQueryRemoveNode();

  const onDeleteNodes = async (heap: NodeRemoveChange[]) => {
    if (heap.length !== 0) {
      let nodesWithCompletedReset = heap.map((item) => item.id);
      if (nodesWithCompletedReset.length > 0) {
        query(nodesWithCompletedReset);
      }
    }
  };

  const setHeep = (change: NodeRemoveChange[]) => {
    if (change.length === 0) {
      return;
    }
    onDeleteNodes(change);
  };

  return { setHeep };
}
