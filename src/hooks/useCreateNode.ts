import { nodeTypes } from "@/components/nodes";
import { ShapeComponents } from "@/components/nodes/shapeNode/ShapeNode";
import { clearInput, randomColor, selectFiles } from "@/flow/utils/randomColor";
import { RefObject } from "react";
import { XYPosition, useReactFlow } from "reactflow";
import { v4 } from "uuid";
import { colorsPalet, defaultNodeData } from "../flow/data";
import { setCreateBuffer } from "../flow/store/playground.slice";
import { useUnit } from "effector-react";
import { $flow } from "@/flow/store/flow.slice";

// TODO: заменить Function на нужный тип
// Заменить везде file на тип
// Все файлы будут вызывать FileNode и уже внутри нее будет различное отображение в зависимости от типа файла

export const fileTypes: Record<string, keyof typeof nodeTypes> = {
  pdf: "file",
  jpeg: "file",
  jpg: "file",
  png: "file",
  mov: "file",
  mp4: "file",
  webm: "file",
};

const useCreateNode = (ref: RefObject<HTMLInputElement>) => {
  const { setNodes } = useReactFlow();
  const flowState = useUnit($flow);

  const clearBufferCreatingType = () =>
    setCreateBuffer({ nodeType: undefined, subType: undefined });

  const addFileNode = async (position: XYPosition, fileList?: FileList) => {
    const files = fileList?.length ? fileList : await selectFiles(ref);

    if (!files?.length) {
      clearBufferCreatingType();
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);

      const type = fileTypes[fileExtension] ?? "file";

      const newNode = {
        id: v4(),
        data: { file },
        type,
        position,
      };

      setNodes((nds) => nds.concat(newNode));
      // Чистим кастомный буфер, чтобы при клике не вызывалось событие добавления ноды
      clearBufferCreatingType();
      // Очищаем инпут, чтобы при выборе того же файла второй раз подряд вызывалось событие onChange
      clearInput(ref);
    }
  };

  const addNode = (
    types: {
      nodeType: keyof typeof nodeTypes;
      subType?: keyof typeof ShapeComponents;
    },
    position: XYPosition,
  ) => {
    const newNode = {
      id: v4(),
      position,
      type: types.nodeType,
      style: { width: 180, height: 180 },
      data: flowState.isDrawingMode
        ? {
            ...defaultNodeData,
            type: types.subType,
            backgroundColor: randomColor(colorsPalet),
            color: randomColor(colorsPalet),
          }
        : undefined,
    };

    setNodes((nds) => nds.concat(newNode));
    if (!flowState.isDrawingMode) {
      clearBufferCreatingType();
    }
  };

  return { addFileNode, addNode };
};

export default useCreateNode;
