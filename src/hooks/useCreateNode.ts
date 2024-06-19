import { nodeTypes } from "@/components/nodes";
import { ShapeComponents } from "@/components/nodes/shapeNode/ShapeNode";
import { clearInput, randomColor, selectFiles } from "@/flow/utils/randomColor";
import { MouseEvent, RefObject, useEffect, useState } from "react";
import { Node, XYPosition, useEdges, useReactFlow } from "reactflow";
import { v4 } from "uuid";
import { colorsPalet, defaultNodeData } from "../flow/data";
import { FileComponents } from "@/components/nodes/FileNode";
import { PlotSize } from "@/components/nodes/svgDrawingNode/types";
import { useUnit } from "effector-react";
import { $draw } from "@/flow/store/draw.slice";
import { useCleaningEmptyCanvasesAfterDrawing } from "./useCleaningEmptyCanvasesAfterDrawing";

// TODO: заменить Function на нужный тип
// Заменить везде file на тип
// Все файлы будут вызывать FileNode и уже внутри нее будет различное отображение в зависимости от типа файла

// Должно наследоваться не от nodeTypes, а от объекта или enum с видами файловых нод (pdf, video, img...)
export const fileSubTypes: Record<string, keyof typeof FileComponents> = {
  pdf: "pdf",
  jpeg: "img",
  jpg: "img",
  png: "img",
  mov: "video",
  mp4: "video",
  webm: "video",
};

export interface ShapeNodeTypes {
  nodeType: keyof typeof nodeTypes;
  subType?: keyof typeof ShapeComponents;
}

function getCurrentParamsDrawingPlot(
  zoom: number,
  position: XYPosition
): [XYPosition, PlotSize] {
  const zoomScale = zoom < 1 ? zoom * 100 : zoom;

  const plotSizeWidth = window.screen.width * zoomScale * 2;
  const plotSizeHeight = window.screen.width * zoomScale * 2;

  const positionCurrent: XYPosition = {
    x: position.x - window.screen.width * zoomScale,
    y: position.y - window.screen.height * zoomScale,
  };

  return [positionCurrent, { width: plotSizeWidth, height: plotSizeHeight }];
}

const useCreateNode = (ref: RefObject<HTMLInputElement>) => {
  const { setNodes, getZoom, screenToFlowPosition } = useReactFlow();
  const drawState = useUnit($draw);

  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleMouseDown = (event: MouseEvent<Element>) => {
    setStartPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: MouseEvent<Element>) => {
    setIsDragging(true);
  };

  const handleMouseUp = (event: MouseEvent<Element>) => {
    if (isDragging && startPosition) {
      const scaledStartPosition = screenToFlowPosition(startPosition);
      const scaledEndPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const width = Math.abs(scaledEndPosition.x - scaledStartPosition.x);
      const height = Math.abs(scaledEndPosition.y - scaledStartPosition.y);

      console.log(width, height);
      addNode({ nodeType: "shape", subType: "rectangle" }, startPosition, {
        width,
        height,
      });

      setIsDragging(false);
    }
  };

  const addNode = (
    types: ShapeNodeTypes,
    position: XYPosition,
    { width, height }: { width: number; height: number }
  ) => {
    const newNode = {
      id: v4(),
      position,
      type: types.nodeType,
      style: { width, height },
      data: {
        ...defaultNodeData,
        type: types.subType,
        backgroundColor: randomColor(colorsPalet),
        color: randomColor(colorsPalet),
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const addFileNode = async (position: XYPosition, fileList?: FileList) => {
    const files = fileList?.length ? fileList : await selectFiles(ref);
    if (!files?.length) return;

    const newNodes: Node[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);

      const type = fileSubTypes[fileExtension] ?? "file";

      const newNode: Node = {
        id: v4(),
        data: { file },
        type,
        position,
      };

      newNodes.push(newNode);
    }

    setNodes((nds) => nds.concat(newNodes));
    // Очищаем инпут, чтобы при выборе того же файла второй раз подряд вызывалось событие onChange
    clearInput(ref);
  };

  const addDrawingNode = (position: XYPosition) => {
    const [pos, size] = getCurrentParamsDrawingPlot(getZoom(), position);

    const newNode = {
      id: v4(),
      position: pos,
      type: "drawing",
      data: {
        plotSize: size,
        lineColor: drawState.color,
        lineWidth: drawState.width,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return {
    addFileNode,
    addNode,
    addDrawingNode,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

export default useCreateNode;
