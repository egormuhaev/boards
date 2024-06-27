import { nodeTypes } from "@/components/nodes";
import { useCleaningEmptyCanvasesAfterDrawing } from "@/hooks/useCleaningEmptyCanvasesAfterDrawing";
import { Button } from "@/shadcn/ui/button";
import { useUnit } from "effector-react";
import { Pencil, Type } from "lucide-react";
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
import { useReactFlow, Node, Edge } from "reactflow";

const FlowHeadToolbar = ({}) => {
  const flowState = useUnit($flow);
  const { buffer } = useUnit($boardPlayground);
  const cleaningEmptyCanvasesAfterDrawing =
    useCleaningEmptyCanvasesAfterDrawing();
  const { setNodes, getNodes, setEdges, getEdges } = useReactFlow();

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
    <nav className="w-[50px] fixed top-1/2 left-5 -translate-y-1/2 flex flex-col z-50 gap-5 p-2 bg-white rounded-lg border border-solid-1 border-slate-300">
      <Button
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          if (flowState.isDrawingMode) {
            clearBufferCreatingType();
          } else {
            saveCreatingTypeInBuffer("drawing");
          }

          let nodes = getNodes().map((item: Node) => ({
            ...item,
            selected: false,
          }));
          let edges = getEdges().map((item: Edge) => ({
            ...item,
            selected: false,
          }));

          setEdges([...edges]);
          setNodes([...nodes]);

          cleaningEmptyCanvasesAfterDrawing();
          changeDrawingMode(!flowState.isDrawingMode);
        }}
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Карандаш"
        style={{
          color: flowState.isDrawingMode ? "white" : undefined,
          background: flowState.isDrawingMode ? "black" : undefined,
        }}
      >
        <Pencil className="h-full w-full" />
      </Button>

      <Button
        onClick={(e) =>
          clickHandler(e, () => {
            disabledDrawingMode();
            if (
              buffer?.nodeType === "shape" &&
              buffer.subType === "rectangle"
            ) {
              clearBufferCreatingType();
            } else {
              saveCreatingTypeInBuffer("shape", "rectangle");
            }
          })
        }
        onDragStart={(event) => onDragStart(event, "shape", "rectangle")}
        draggable
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Прямоугольник"
        style={{
          color:
            buffer?.nodeType === "shape" && buffer.subType === "rectangle"
              ? "white"
              : undefined,
          background:
            buffer?.nodeType === "shape" && buffer.subType === "rectangle"
              ? "black"
              : undefined,
        }}
      >
        <LuRectangleHorizontal className="h-full w-full" />
      </Button>

      <Button
        onClick={(e) =>
          clickHandler(e, () => {
            disabledDrawingMode();
            if (buffer?.nodeType === "shape" && buffer.subType === "circle") {
              clearBufferCreatingType();
            } else {
              saveCreatingTypeInBuffer("shape", "circle");
            }
          })
        }
        onDragStart={(event) => onDragStart(event, "shape", "circle")}
        draggable
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Круг"
        style={{
          color:
            buffer?.nodeType === "shape" && buffer.subType === "circle"
              ? "white"
              : undefined,
          background:
            buffer?.nodeType === "shape" && buffer.subType === "circle"
              ? "black"
              : undefined,
        }}
      >
        <LuCircle className="h-full w-full" />
      </Button>

      <Button
        onClick={(e) =>
          clickHandler(e, () => {
            disabledDrawingMode();
            if (buffer?.nodeType === "text") {
              clearBufferCreatingType();
            } else {
              saveCreatingTypeInBuffer("text");
            }
          })
        }
        onDragStart={(event) => onDragStart(event, "text")}
        draggable
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Текст"
        style={{
          color: buffer?.nodeType === "text" ? "white" : undefined,
          background: buffer?.nodeType === "text" ? "black" : undefined,
        }}
      >
        <Type className="h-full w-full" />
      </Button>

      <Button
        onClick={(e) =>
          clickHandler(e, () => {
            disabledDrawingMode();
            if (buffer?.nodeType === "file") {
              clearBufferCreatingType();
            } else {
              saveCreatingTypeInBuffer("file");
            }
          })
        }
        onDragStart={(event) => onDragStart(event, "file")}
        draggable
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Файл"
        style={{
          color: buffer?.nodeType === "file" ? "white" : undefined,
          background: buffer?.nodeType === "file" ? "black" : undefined,
        }}
      >
        <FaFile className="h-full w-full" />
      </Button>
    </nav>
  );
};

export default FlowHeadToolbar;
