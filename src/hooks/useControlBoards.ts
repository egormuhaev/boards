import { useState } from "react";
import {
  useOnViewportChange,
  useReactFlow,
  UseOnViewportChangeOptions,
  Viewport,
  useKeyPress,
} from "reactflow";

export function useControlBoards() {
  const { getViewport, setViewport } = useReactFlow();
  const [viewportOnLastValue, setViewportOnLastValue] =
    useState<Viewport | null>(null);

  const spacePressed = useKeyPress("Space");

  const viewportOnStart: UseOnViewportChangeOptions["onStart"] = (
    viewport: Viewport
  ) => {
    setViewportOnLastValue(viewport);
  };

  const viewportOnEnd: UseOnViewportChangeOptions["onEnd"] = (_: Viewport) => {
    setViewportOnLastValue(null);
  };

  const viewportOnChange: UseOnViewportChangeOptions["onChange"] = (
    _: Viewport
  ) => {
    // const conditions =
    //   !viewportOnLastValue ||
    //   (getViewport().x === viewportOnLastValue.x &&
    //     getViewport().y === viewportOnLastValue.y) ||
    //   !spacePressed;
    // if (conditions) {
    //   setViewport(viewportOnLastValue!);
    // }
    // return null;
  };

  useOnViewportChange({
    onEnd: viewportOnEnd,
    onStart: viewportOnStart,
    onChange: viewportOnChange,
  });
}
