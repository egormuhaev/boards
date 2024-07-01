import { nodeTypes } from "@/components/nodes";

import { isMobile } from "react-device-detect";

import {
  clearInput,
  randomColor,
  selectFiles,
  uploadFiles,
} from "@/flow/utils/randomColor";
import { CSSProperties, RefObject, useCallback, useState } from "react";

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

import { CustomFile } from "@/components/nodes/fileNodes/files/types";
import { ShapeComponents } from "@/components/nodes/shapeNode/Shape";
import { ShapeNodeData } from "@/components/nodes/shapeNode/ShapeNode";
import {
  $boardPlayground,
  clearBufferCreatingType,
} from "@/flow/store/playground.slice";
import { $flow } from "@/flow/store/flow.slice";

const defaultNodeSizes: Omit<
  Record<
    keyof Omit<typeof nodeTypes, "drawing">,
    { width: number; height: number }
  >,
  "drawing" | "drawingMobile"
> = {
  shape: { width: 180, height: 180 },
  file: { width: 500, height: 600 },
  text: { width: 180, height: 40 },
};

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
  webp: "image",
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

const useCreateNode = () => {
  const { setNodes, getZoom } = useReactFlow();
  const drawState = useUnit($draw);
  const flowState = useUnit($flow);
  const { buffer } = useUnit($boardPlayground);
  const { createNewNode } = useCreateNewNodeServer();

  const addShapeNode = (
    position: XYPosition,
    style: CSSProperties,
    data: ShapeNodeData,
  ) => {
    const newNode = {
      id: v4(),
      position,
      type: "shape",
      style,
      data: {
        ...defaultNodeData,
        ...data,
        backgroundColor: randomColor(colorsPalet),
        color: randomColor(colorsPalet),
      },
    };

    createNewNode(newNode);
    setNodes((nds) => nds.concat(newNode));
    clearBufferCreatingType();
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
    clearBufferCreatingType();
  };

  const addFileNode = useCallback(
    async (
      position: XYPosition,
      { width, height }: { width: number; height: number },
      fileList?: FileList,
    ) => {
      const files = fileList
        ? await uploadFiles(fileList)
        : await selectFiles();
      if (!files?.length) return;

      const newNodes: Node[] = [];

      for (let i = 0; i < files.length; i++) {
        const file: CustomFile = files[i];

        const type = fileSubTypes[file.fileExtension] ?? "file";

        const newNode: Node = {
          id: v4(),
          data: { type, ...file },
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

      clearBufferCreatingType();
    },
    [],
  );

  const addDrawingNode = (position: XYPosition) => {
    const [pos, size] = getCurrentParamsDrawingPlot(getZoom(), position);
    const id = v4();
    const newNode: Node<any> = {
      id: id,
      position: pos,
      type: isMobile ? "drawingMobile" : "drawing",
      data: {
        isActual: false,
        points: [],
        plotSize: size,
        lineColor: drawState.color,
        lineWidth: drawState.width,
        tool: drawState.tool,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addShapeNodeOnResize = (
    startPosition: XYPosition,
    endPosition: XYPosition,
    data: ShapeNodeData,
  ) => {
    const smartStartPosition = {
      x: startPosition.x < endPosition.x ? startPosition.x : endPosition.x,
      y: startPosition.y < endPosition.y ? startPosition.y : endPosition.y,
    };

    const width = Math.abs(endPosition.x - startPosition.x);
    const height = Math.abs(endPosition.y - startPosition.y);

    const sizes = { width, height };

    addShapeNode(smartStartPosition, sizes, data);
  };

  const addNode = async ({
    startPosition,
    endPosition,
    files,
  }: {
    startPosition: XYPosition;
    endPosition?: XYPosition;
    files?: FileList;
  }) => {
    if (flowState.isDrawingMode) {
      addDrawingNode(startPosition);
      return;
    }

    if (buffer?.nodeType === "shape") {
      if (!buffer.subType) return;

      if (
        startPosition.x === endPosition?.x &&
        startPosition.y === endPosition.y
      ) {
        addShapeNode(startPosition, defaultNodeSizes[buffer.nodeType], {
          type: buffer.subType,
        });
      } else {
        if (endPosition) {
          addShapeNodeOnResize(startPosition, endPosition, {
            type: buffer.subType,
          });
        }
      }
    } else if (buffer?.nodeType === "text") {
      addTextNode(startPosition, defaultNodeSizes[buffer.nodeType]);
    } else if (buffer?.nodeType === "file") {
      // Добавить получение файлов внутри функции
      await addFileNode(
        startPosition,
        defaultNodeSizes[buffer.nodeType],
        files,
      );
    }
  };

  return {
    addNode,
    addDrawingNode,
  };
};

export default useCreateNode;
