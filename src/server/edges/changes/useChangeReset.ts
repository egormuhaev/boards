import { EdgeResetChange } from "reactflow";
import { useQueryUpdateEdges } from "@/server/query/useQueryUpdateEdges";

export function useChangeEdgesReset() {
  const query = useQueryUpdateEdges();

  const onChangeReset = async (heap: EdgeResetChange[]) => {
    if (heap.length !== 0) {
      let edgesWithCompletedReset = heap.map((item) => item.item);
      if (edgesWithCompletedReset.length > 0) {
        query(edgesWithCompletedReset);
      }
    }
  };

  const setHeep = async (change: EdgeResetChange[]) => {
    if (change.length === 0) {
      return;
    }
    onChangeReset(change);
  };

  return { setHeep };
}
