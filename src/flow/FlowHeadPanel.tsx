import { nodeTypes } from "@/components/nodes";
import { useCleaningEmptyCanvasesAfterDrawing } from "@/hooks/useCleaningEmptyCanvasesAfterDrawing";
import { Button } from "@/shadcn/ui/button";
import { useUnit } from "effector-react";
import { ArrowLeft, Pencil, Type } from "lucide-react";
import { DragEvent, MouseEvent } from "react";
import { FaFile } from "react-icons/fa";
import { LuCircle, LuRectangleHorizontal } from "react-icons/lu";
import { $flow, changeDrawingMode } from "./store/flow.slice";
import {
  $boardPlayground,
  clearBufferCreatingType,
  setCreateBuffer,
} from "./store/playground.slice";
import { ShapeComponents } from "@/components/nodes/shapeNode/Shape";
import { useNavigate } from "react-router-dom";

const FlowHeadPanel = ({}) => {
  const navigate = useNavigate();
  const flowState = useUnit($flow);
  const { buffer } = useUnit($boardPlayground);
  const cleaningEmptyCanvasesAfterDrawing =
    useCleaningEmptyCanvasesAfterDrawing();

  const saveCreatingTypeInBuffer = (
    nodeType: keyof typeof nodeTypes,
    subType?: keyof typeof ShapeComponents,
  ) => {
    setCreateBuffer({
      nodeType,
      subType,
    });
  };

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
