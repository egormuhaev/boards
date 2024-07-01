import { setDrawingMobileContainerId } from "@/flow/store/draw.slice";
import { $flow, changeDrawingMode } from "@/flow/store/flow.slice";
import {
  clearBufferCreatingType,
  setCreateBuffer,
} from "@/flow/store/playground.slice";
import { useUnit } from "effector-react";
import useCreateNode from "./useCreateNode";
import { useReactFlow } from "reactflow";
import { isMobile } from "react-device-detect";

export default function useDrawingMode() {
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
    if (isMobile) {
      addDrawingNode({ x: getViewport().x, y: getViewport().y });
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
  };
}
