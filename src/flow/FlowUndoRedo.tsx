import useUndoRedo from "@/hooks/useUndoRedo";
import { Redo, Undo } from "lucide-react";
import { useEffect } from "react";

//FIXME: не обновляется

const FlowUndoRedo = () => {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  return (
    <div className="absolute z-50 bottom-5 left-1/2 -translate-x-1/2 bg-white border border=solid-1 border-slate-300 rounded-lg flex gap-2 p-2">
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
