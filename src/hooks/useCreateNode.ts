import { nodeTypes } from "@/components/nodes";
import { ShapeComponents } from "@/components/nodes/shapeNode/ShapeNode";
import { clearInput, randomColor, selectFiles } from "@/flow/utils/randomColor";
import { RefObject, useCallback } from "react";
import { Node, XYPosition, useReactFlow } from "reactflow";
import { v4 } from "uuid";
import {
  colorsPalet,
  defaultNodeData,
  defaultTextNodeData,
} from "../flow/data";
import { useUnit } from "effector-react";
import { $draw } from "@/flow/store/draw.slice";
import { PlotSize } from "@/components/nodes/svgDrawingNode/desktop/types";
import { FileComponents } from "@/components/nodes/fileNodes/FileNode";
import { useCreateNewNodeServer } from "../server/nodes/create/useCreateNewNode";

// TODO: заменить Function на нужный тип
// Заменить везде file на тип
// Все файлы будут вызывать FileNode и уже внутри нее будет различное отображение в зависимости от типа файла

export const fileSubTypes: Record<string, keyof typeof FileComponents> = {
  mov: "video",
  mp4: "video",
  webm: "video",
  jpg: "image",
  jpeg: "image",
  png: "image",
  pdf: "pdf",
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
  const plotSizeHeight = window.screen.height * zoomScale * 2;

  const positionCurrent: XYPosition = {
    x: position.x - window.screen.width * zoomScale,
    y: position.y - window.screen.height * zoomScale,
  };

  return [positionCurrent, { width: plotSizeWidth, height: plotSizeHeight }];
}

const useCreateNode = (ref: RefObject<HTMLInputElement>) => {
  const { setNodes, getZoom } = useReactFlow();
  const drawState = useUnit($draw);
  const createNewNode = useCreateNewNodeServer();

  const addShapeNode = (
    types: ShapeNodeTypes,
    position: XYPosition,
    { width, height }: { width: number; height: number },
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
    createNewNode(newNode);
    setNodes((nds) => nds.concat(newNode));
  };

  const addTextNode = (
    position: XYPosition,
    { width, height }: { width: number; height: number },
  ) => {
    const newNode = {
      id: v4(),
      position,
      type: "text",
      style: { width, height },
      data: defaultTextNodeData,
    };

    createNewNode(newNode);

    setNodes((nds) => nds.concat(newNode));
  };

  const addFileNode = useCallback(
    async (
      position: XYPosition,
      { width, height }: { width: number; height: number },
      fileList?: FileList,
    ) => {
      const files = fileList?.length ? fileList : await selectFiles(ref);
      if (!files?.length) return;

      const newNodes: Node[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);

        const type = fileSubTypes[fileExtension] ?? "file";

        const newNode: Node = {
          id: v4(),
          data: { file, type },
          type: "file",
          style:
            type === "pdf"
              ? { width, height }
              : type === "video"
                ? { height: 500 }
                : undefined,
          position,
        };

        createNewNode(newNode);

        newNodes.push(newNode);
      }

      setNodes((nds) => nds.concat(newNodes));
      // Очищаем инпут, чтобы при выборе того же файла второй раз подряд вызывалось событие onChange
      clearInput(ref);
    },
    [],
  );

  const addDrawingNode = (position: XYPosition) => {
    const [pos, size] = getCurrentParamsDrawingPlot(getZoom(), position);
    const id = v4();

    const newNode = {
      id: id,
      position: pos,
      type: "drawing",
      data: {
        points: [],
        plotSize: size,
        lineColor: drawState.color,
        lineWidth: drawState.width,
        tool: drawState.tool,
      },
    };

    createNewNode(newNode);
    setNodes((nds) => nds.concat(newNode));
  };

  return {
    addFileNode,
    addTextNode,
    addShapeNode,
    addDrawingNode,
  };
};

export default useCreateNode;
