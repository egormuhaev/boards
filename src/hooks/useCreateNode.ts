import { nodeTypes } from "@/components/nodes";
import { ShapeComponents } from "@/components/nodes/shapeNode/ShapeNode";
import { clearInput, randomColor, selectFiles } from "@/flow/utils/randomColor";
import { MouseEvent, RefObject, useCallback, useState } from "react";
import { Node, XYPosition, useReactFlow } from "reactflow";
import { v4 } from "uuid";
import { colorsPalet, defaultNodeData } from "../flow/data";
import { FileComponents } from "@/components/nodes/FileNode";
import { useUnit } from "effector-react";
import { $draw } from "@/flow/store/draw.slice";
import { $boardPlayground } from "@/flow/store/playground.slice";
import { PlotSize } from "@/components/nodes/svgDrawingNode/desktop/types";

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
  const plotSizeHeight = window.screen.height * zoomScale * 2;

  const positionCurrent: XYPosition = {
    x: position.x - window.screen.width * zoomScale,
    y: position.y - window.screen.height * zoomScale,
  };

  return [positionCurrent, { width: plotSizeWidth, height: plotSizeHeight }];
}

const useCreateNode = (ref: RefObject<HTMLInputElement>) => {
  const { setNodes, getZoom, screenToFlowPosition } = useReactFlow();
  const drawState = useUnit($draw);
  const { buffer } = useUnit($boardPlayground);

  const [isMoving, setIsMoving] = useState(false);
  const [startPosition, setStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const setPosition = useCallback(
    (event: MouseEvent) =>
      setStartPosition({ x: event.clientX, y: event.clientY }),
    [],
  );

  const activateMoving = useCallback(() => setIsMoving(true), []);
  const disactivateMoving = useCallback(() => setIsMoving(false), []);

  const addNodeOnResize = (event: MouseEvent) => {
    if (buffer?.nodeType && buffer.subType && isMoving && startPosition) {
      const scaledStartPosition = screenToFlowPosition(startPosition);
      const scaledEndPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const width = Math.abs(scaledEndPosition.x - scaledStartPosition.x);
      const height = Math.abs(scaledEndPosition.y - scaledStartPosition.y);

      const smartStartPosition = {
        x:
          scaledStartPosition.x < scaledEndPosition.x
            ? scaledStartPosition.x
            : scaledEndPosition.x,
        y:
          scaledStartPosition.y < scaledEndPosition.y
            ? scaledStartPosition.y
            : scaledEndPosition.y,
      };

      addNode(
        { nodeType: buffer?.nodeType, subType: buffer.subType },
        smartStartPosition,
        {
          width,
          height,
        },
      );
    }
  };

  const addNode = (
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

    setNodes((nds) => nds.concat(newNode));
  };

  const addFileNode = useCallback(
    async (position: XYPosition, fileList?: FileList) => {
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

    setNodes((nds) => nds.concat(newNode));
  };

  return {
    addFileNode,
    addNode,
    addDrawingNode,
    activateMoving,
    addNodeOnResize,
    setPosition,
    disactivateMoving,
    isMoving,
  };
};

export default useCreateNode;
