import { NodeSelectionChange } from "reactflow";
import { useQueryUpdateNodesByIds } from "@/server/query/useQueryUpdateNodesByIds";

export function useChangeSelect() {
  const query = useQueryUpdateNodesByIds();

  const onChangeSelect = async (heap: NodeSelectionChange[]) => {
    if (heap.length !== 0) {
      let nodesWithCompletedSelect = heap.map((item) => item.id);
      if (nodesWithCompletedSelect.length > 0) {
        query(nodesWithCompletedSelect);
      }
    }
  };

  const setHeep = async (change: NodeSelectionChange[]) => {
    if (change.length === 0) {
      return;
    }

    onChangeSelect(change);
  };

  return { setHeep };
}
