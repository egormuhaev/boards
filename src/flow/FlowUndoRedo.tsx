import useUndoRedo from "@/hooks/useUndoRedo";
import { Redo, Undo } from "lucide-react";
import { useEffect } from "react";

//FIXME: не обновляется

const FlowUndoRedo = () => {
  const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();

  useEffect(() => {
    console.log("snapshot into FlowUndoRedo");
  }, [undo, redo, takeSnapshot]);

  return (
    <>
      <button disabled={canUndo} onClick={undo}>
        <Undo color={!canUndo ? "black" : "#e5e7eb"} />
      </button>
      <button disabled={canRedo} onClick={redo}>
        <Redo color={!canRedo ? "black" : "#e5e7eb"} />
      </button>
    </>
  );
};

export default FlowUndoRedo;
