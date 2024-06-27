import { NodeDimensionChange } from "reactflow";
import { useQueryUpdateNodesByIds } from "@/server/query/useQueryUpdateNodesByIds";

export function useChangeDimension() {
  const query = useQueryUpdateNodesByIds();

  const onChangeDimension = async (heap: NodeDimensionChange[]) => {
    if (heap.length !== 0) {
      let nodesWithCompletedResize = [];
      for (let i = 0; i < heap.length; i++) {
        if (heap[i].resizing === false) {
          nodesWithCompletedResize.push(heap[i].id);
        }
      }

      if (nodesWithCompletedResize.length > 0) {
        query(nodesWithCompletedResize);
      }
    }
  };

  const setHeep = async (change: NodeDimensionChange[]) => {
    const chengeDontHaveCompleteElement = change.filter(
      (item) => item.resizing === false,
    );
    if (chengeDontHaveCompleteElement.length === 0) {
      return;
    }

    onChangeDimension(change);
  };

  return { setHeep };
}
