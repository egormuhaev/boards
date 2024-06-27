import { NodeResetChange } from "reactflow";
import { useQueryUpdateNodes } from "@/server/query/useQueryUpdateNodes";

export function useChangeReset() {
  const query = useQueryUpdateNodes();

  const onChangeReset = async (heap: NodeResetChange[]) => {
    if (heap.length !== 0) {
      let nodesWithCompletedReset = heap.map((item) => item.item);
      if (nodesWithCompletedReset.length > 0) {
        query(nodesWithCompletedReset);
      }
    }
  };

  const setHeep = async (change: NodeResetChange[]) => {
    if (change.length === 0) {
      return;
    }
    onChangeReset(change);
  };

  return { setHeep };
}
