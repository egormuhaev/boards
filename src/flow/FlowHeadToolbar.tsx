import { Button } from "@/shadcn/ui/button";
import { useUnit } from "effector-react";
import { $flow, changeDrawingMode } from "./store/flow.slice";
import { setCreateBuffer } from "./store/playground.slice";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { FaPhotoVideo, FaFile } from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import { NodeTypes } from "@/components";
import { Pencil, Type } from "lucide-react";

const FlowHeadToolbar = () => {
  const flowState = useUnit($flow);

  const saveNewNodeDataInBuffer = (type: string) => (_: React.MouseEvent) => {
    setCreateBuffer({
      type,
    });
  };

  return (
    <nav className="w-[50px] fixed top-1/2 left-5 -translate-y-1/2 flex flex-col z-50 gap-5 p-2 bg-white rounded-lg border border-solid-1 border-slate-300">
      <Button
        onClick={() => {
          changeDrawingMode(!flowState.isDrawingMode);
        }}
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Карандаш"
      >
        <Pencil className="h-full w-full" />
      </Button>

      <Button
        onClick={saveNewNodeDataInBuffer(NodeTypes.RectTextNodeFlowTypes)}
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Блок"
      >
        <LuRectangleHorizontal className="h-full w-full" />
      </Button>

      <Button
        onClick={saveNewNodeDataInBuffer(NodeTypes.TextNodeFlowTypes)}
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Текст"
      >
        <Type className="h-full w-full" />
      </Button>

      <Button
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Файл"
      >
        <FaFile className="h-full w-full" />
      </Button>

      <Button
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Звук"
      >
        <BsMusicNoteBeamed className="h-full w-full" />
      </Button>

      <Button
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Медиа"
      >
        <FaPhotoVideo className="h-full w-full" />
      </Button>
    </nav>
  );
};

export default FlowHeadToolbar;
