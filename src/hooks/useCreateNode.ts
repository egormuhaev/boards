import { nodeTypes } from "@/components/nodes";
import { ShapeComponents } from "@/components/nodes/shapeNode/ShapeNode";
import { clearInput, randomColor, selectFiles } from "@/flow/utils/randomColor";
import { RefObject } from "react";
import { Node, XYPosition, useReactFlow } from "reactflow";
import { v4 } from "uuid";
import { colorsPalet, defaultNodeData } from "../flow/data";
import { FileComponents } from "@/components/nodes/FileNode";
import { PlotSize } from "@/components/nodes/svgDrawingNode/types";

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
  position: XYPosition,
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
  const { setNodes, getZoom } = useReactFlow();

  const addNode = (types: ShapeNodeTypes, position: XYPosition) => {
    const newNode = {
      id: v4(),
      position,
      type: types.nodeType,
      style: { width: 180, height: 180 },
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
      style: { width: 180, height: 180 },
      data: {
        plotSize: size,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return { addFileNode, addNode, addDrawingNode };
};

export default useCreateNode;
