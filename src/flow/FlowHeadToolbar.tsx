import { Button } from "@/shadcn/ui/button";
import { useUnit } from "effector-react";
import { $flow, changeDrawingMode } from "./store/flow.slice";
import { setCreateBuffer } from "./store/playground.slice";
import { FaFile } from "react-icons/fa";
import { LuCircle, LuRectangleHorizontal } from "react-icons/lu";
import { Pencil, Type } from "lucide-react";
import { DragEvent } from "react";
import { NodeTypes } from "@/components/nodes";

const FlowHeadToolbar = ({}) => {
  const flowState = useUnit($flow);

  const saveCreatingTypeInBuffer = (type: NodeTypes) => {
    setCreateBuffer({
      creatingType: type,
    });
  };

  const onDragStart = (
    event: DragEvent<HTMLButtonElement>,
    nodeType: NodeTypes
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
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
        onClick={() =>
          saveCreatingTypeInBuffer(NodeTypes.RectangleNodeFlowTypes)
        }
        onDragStart={(event) =>
          onDragStart(event, NodeTypes.RectangleNodeFlowTypes)
        }
        draggable
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Прямоугольник"
      >
        <LuRectangleHorizontal className="h-full w-full" />
      </Button>

      <Button
        onClick={() => saveCreatingTypeInBuffer(NodeTypes.CircleNodeFlowTypes)}
        onDragStart={(event) =>
          onDragStart(event, NodeTypes.CircleNodeFlowTypes)
        }
        draggable
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Круг"
      >
        <LuCircle className="h-full w-full" />
      </Button>

      <Button
        onClick={() => saveCreatingTypeInBuffer(NodeTypes.TextNodeFlowTypes)}
        onDragStart={(event) => onDragStart(event, NodeTypes.TextNodeFlowTypes)}
        draggable
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Текст"
      >
        <Type className="h-full w-full" />
      </Button>

      <Button
        onClick={() => saveCreatingTypeInBuffer(NodeTypes.FileNodeFlowTypes)}
        onDragStart={(event) => onDragStart(event, NodeTypes.FileNodeFlowTypes)}
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
