import { Button } from "@/shadcn/ui/button";
import { useUnit } from "effector-react";
import { $flow, changeDrawingMode } from "./store/flow.slice";
import { setCreateBuffer } from "./store/playground.slice";
import { LuCircle, LuRectangleHorizontal } from "react-icons/lu";
import { Pencil, Type } from "lucide-react";
import { DragEvent } from "react";
import { ShapeComponents } from "@/components/nodes/shapeNode/ShapeNode";
import { nodeTypes } from "@/components/nodes";
import { FaFile } from "react-icons/fa";
import { useCleaningEmptyCanvasesAfterDrawing } from "@/hooks/useCleaningEmptyCanvasesAfterDrawing";

const FlowHeadToolbar = ({}) => {
  const flowState = useUnit($flow);
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

  const onDragStart = (
    event: DragEvent<HTMLButtonElement>,
    nodeType: keyof typeof nodeTypes,
    subType?: keyof typeof ShapeComponents,
  ) => {
    event.dataTransfer.setData("nodeType", nodeType);
    if (subType) event.dataTransfer.setData("subType", subType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <nav className="w-[50px] fixed top-1/2 left-5 -translate-y-1/2 flex flex-col z-50 gap-5 p-2 bg-white rounded-lg border border-solid-1 border-slate-300">
      <Button
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          cleaningEmptyCanvasesAfterDrawing();
          changeDrawingMode(!flowState.isDrawingMode);
          if (!flowState.isDrawingMode) {
            saveCreatingTypeInBuffer("drawing");
          }
        }}
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Карандаш"
        style={{
          background: flowState.isDrawingMode ? "yellow" : undefined,
        }}
      >
        <Pencil className="h-full w-full" />
      </Button>

      <Button
        onClick={() => saveCreatingTypeInBuffer("shape", "rectangle")}
        onDragStart={(event) => onDragStart(event, "shape", "rectangle")}
        draggable
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Прямоугольник"
      >
        <LuRectangleHorizontal className="h-full w-full" />
      </Button>

      <Button
        onClick={() => saveCreatingTypeInBuffer("shape", "circle")}
        onDragStart={(event) => onDragStart(event, "shape", "circle")}
        draggable
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Круг"
      >
        <LuCircle className="h-full w-full" />
      </Button>

      <Button
        onClick={() => saveCreatingTypeInBuffer("text")}
        onDragStart={(event) => onDragStart(event, "text")}
        draggable
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Текст"
      >
        <Type className="h-full w-full" />
      </Button>

      <Button
        onClick={() => saveCreatingTypeInBuffer("file")}
        onDragStart={(event) => onDragStart(event, "file")}
        draggable
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Файл"
      >
        <FaFile className="h-full w-full" />
      </Button>

      {/* <Button
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Звук"
      >
        <BsMusicNoteBeamed className="h-full w-full" />
      </Button>

      <Button
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Медиа"
      >
        <FaPhotoVideo
          onClick={saveNewNodeDataInBuffer(NodeTypes.VideoNodeFlowTypes)}
          className="h-full w-full"
        />
      </Button> */}
    </nav>
  );
};

export default FlowHeadToolbar;
