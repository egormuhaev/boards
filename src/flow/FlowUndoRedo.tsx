import useUndoRedo from "@/hooks/useUndoRedo";
import { Redo, Undo } from "lucide-react";

//FIXME: не обновляется

const FlowUndoRedo = () => {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  return (
    <div className="flex">
      <button disabled={canUndo} onClick={undo}>
        <Undo color={!canUndo ? "black" : "#e5e7eb"} />
      </button>
      <button disabled={canRedo} onClick={redo}>
        <Redo color={!canRedo ? "black" : "#e5e7eb"} />
      </button>
    </div>
  );
};

export default FlowUndoRedo;
