import { RefObject } from "react";
import { useReactFlow, XYPosition } from "reactflow";
import { setCreateBuffer } from "../flow/store/playground.slice";
import { v4 } from "uuid";
import { colorsPalet, defaultNodeData } from "../flow/data";
import { clearInput, randomColor, selectFiles } from "@/flow/utils/randomColor";
import { NodeTypes } from "@/components/nodes";

export const fileTypes: Record<string, NodeTypes> = {
  pdf: NodeTypes.PDFNodeFlowTypes,
  jpeg: NodeTypes.PictureNodeFlowTypes,
  jpg: NodeTypes.PictureNodeFlowTypes,
  png: NodeTypes.PictureNodeFlowTypes,
  mov: NodeTypes.VideoNodeFlowTypes,
  mp4: NodeTypes.VideoNodeFlowTypes,
  webm: NodeTypes.VideoNodeFlowTypes,
};

const useCreateNode = (ref: RefObject<HTMLInputElement>) => {
  const { setNodes } = useReactFlow();

  const clearBufferCreatingType = () =>
    setCreateBuffer({ creatingType: undefined });

  const addFileNode = async (position: XYPosition, fileList?: FileList) => {
    const files = fileList?.length ? fileList : await selectFiles(ref);

    if (!files?.length) {
      clearBufferCreatingType();
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);

      const type = fileTypes[fileExtension] ?? NodeTypes.FileNodeFlowTypes;

      const newNode = {
        id: v4(),
        data: { file },
        type,
        position,
      };

      setNodes((nds) => nds.concat(newNode));
      // Чистим кастомный буфер, чтобы при клике не вызвалось событие добавления ноды
      clearBufferCreatingType();
      // Очищаем инпут, чтобы при выборе того же файла второй раз подряд вызывалось событие onChange
      clearInput(ref);
    }
  };

  const addNode = (creatingType: NodeTypes, position: XYPosition) => {
    const newNode = {
      id: v4(),
      type: creatingType,
      position,
      data: {
        ...defaultNodeData,
        bgColor: randomColor(colorsPalet),
        textColor: randomColor(colorsPalet),
      },
    };

    setNodes((nds) => nds.concat(newNode));
    clearBufferCreatingType();
  };

  return { addFileNode, addNode };
};

export default useCreateNode;
