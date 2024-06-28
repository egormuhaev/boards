import { useCleaningEmptyCanvasesAfterDrawing } from "@/hooks/useCleaningEmptyCanvasesAfterDrawing";
import { Button } from "@/shadcn/ui/button";
import { useUnit } from "effector-react";
import { ArrowLeft } from "lucide-react";
import { MouseEvent } from "react";
import { $flow, changeDrawingMode } from "./store/flow.slice";
import { clearBufferCreatingType } from "./store/playground.slice";
import { useNavigate } from "react-router-dom";

const FlowHeadPanel = ({}) => {
  const navigate = useNavigate();
  const flowState = useUnit($flow);
  const cleaningEmptyCanvasesAfterDrawing =
    useCleaningEmptyCanvasesAfterDrawing();

  const clickHandler = (e: MouseEvent<HTMLButtonElement>, func: Function) => {
    e.preventDefault();
    e.stopPropagation();

    func();
  };

  const disabledDrawingMode = () => {
    if (flowState.isDrawingMode) {
      changeDrawingMode(false);
      clearBufferCreatingType();
      cleaningEmptyCanvasesAfterDrawing();
    }
  };

  return (
    <nav className="w-[50px] fixed top-5 left-5 flex z-50 gap-5 p-2 bg-white rounded-lg border border-solid-1 border-slate-300">
      <Button
        onClick={(e) =>
          clickHandler(e, () => {
            disabledDrawingMode();
            navigate("/");
          })
        }
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Вернуться к доскам"
      >
        <ArrowLeft className="h-full w-full" />
      </Button>
    </nav>
  );
};

export default FlowHeadPanel;
