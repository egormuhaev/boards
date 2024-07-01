import { setDrawingMobileContainerId } from "@/flow/store/draw.slice";
import { $flow, changeDrawingMode } from "@/flow/store/flow.slice";
import {
  clearBufferCreatingType,
  setCreateBuffer,
} from "@/flow/store/playground.slice";
import { useUnit } from "effector-react";
import useCreateNode from "./useCreateNode";
import { useReactFlow, XYPosition } from "reactflow";
import { isMobile } from "react-device-detect";
import { useCleaningEmptyCanvasesAfterDrawing } from "./useCleaningEmptyCanvasesAfterDrawing";

export default function useDrawingMode() {
  const cleaningEmptyCanvasesAfterDrawing =
    useCleaningEmptyCanvasesAfterDrawing();
  const flowState = useUnit($flow);
  const { getViewport } = useReactFlow();
  const { addDrawingNode } = useCreateNode();

  const disactivated = () => {
    changeDrawingMode(false);
    setDrawingMobileContainerId(null);
    clearBufferCreatingType();
  };

  const activated = () => {
    changeDrawingMode(true);
    setCreateBuffer({
      nodeType: "drawing",
    });

    const position: XYPosition = { x: getViewport().x, y: getViewport().y };

    if (isMobile) {
      addDrawingNode(position);
    }
  };

  const onDrawingMode = () => {
    if (flowState.isDrawingMode) {
      disactivated();
    } else {
      activated();
    }
  };

  return {
    isDrawingMode: flowState.isDrawingMode,
    onDrawingMode,
    cleaningCanvas: cleaningEmptyCanvasesAfterDrawing,
  };
}
