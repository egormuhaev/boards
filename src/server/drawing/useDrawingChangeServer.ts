import { useSendingModifiedNodeValues } from "../query/useSendingModifiedNodeValues";

export function useDrawingChangeServer() {
  const query = useSendingModifiedNodeValues();

  const updateDrawingNode = (id: string) => {
    query([id]);
  };

  return updateDrawingNode;
}
