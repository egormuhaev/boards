import { EdgeRemoveChange } from "reactflow";
import { useQueryRemoveEdges } from "@/server/query/useQueryRemoveEdges";

export function useDeleteEdges() {
  const query = useQueryRemoveEdges();

  const onDeleteNodes = async (heap: EdgeRemoveChange[]) => {
    if (heap.length !== 0) {
      let edgesWithCompletedDelete = heap.map((item) => item.id);
      if (edgesWithCompletedDelete.length > 0) {
        query(edgesWithCompletedDelete);
      }
    }
  };

  const setHeep = (change: EdgeRemoveChange[]) => {
    if (change.length === 0) {
      return;
    }
    onDeleteNodes(change);
  };

  return { setHeep };
}
