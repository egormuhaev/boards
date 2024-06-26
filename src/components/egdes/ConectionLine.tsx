import { useEffect, useState } from "react";
import { MarkerType, type ConnectionLineComponentProps } from "reactflow";
import {
  setConnectionLinePath,
  $boardPlayground,
} from "@/flow/store/playground.slice";
import { getPath } from "./EditableEdge";
import { Algorithm, COLORS, DEFAULT_ALGORITHM } from "./EditableEdge/constants";
import { useUnit } from "effector-react";

const DISTANCE = DEFAULT_ALGORITHM === Algorithm.BezierCatmullRom ? 50 : 25;

export function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  connectionStatus,
}: ConnectionLineComponentProps) {
  const playgroundState = useUnit($boardPlayground);

  const [freeDrawing, setFreeDrawing] = useState(false);

  const prev = playgroundState.connectionLinePath[
    playgroundState.connectionLinePath.length - 1
  ] ?? {
    x: fromX,
    y: fromY,
  };
  const distance = Math.hypot(prev.x - toX, prev.y - toY);
  const shouldAddPoint = freeDrawing && distance > DISTANCE;

  useEffect(() => {
    if (shouldAddPoint) {
      setConnectionLinePath([
        ...playgroundState.connectionLinePath,
        { x: toX, y: toY },
      ]);
    }
  }, [
    playgroundState.connectionLinePath,
    setConnectionLinePath,
    shouldAddPoint,
    toX,
    toY,
  ]);

  useEffect(() => {
    // pressing or holding the space key enables free drawing
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === " ") {
        setFreeDrawing(true);
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === " ") {
        setFreeDrawing(false);
      }
    }

    setConnectionLinePath([]);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      setFreeDrawing(false);
    };
  }, [setConnectionLinePath]);

  const path = getPath(
    [
      { x: fromX, y: fromY },
      ...playgroundState.connectionLinePath,
      { x: toX, y: toY },
    ],
    DEFAULT_ALGORITHM,
    { fromSide: fromPosition, toSide: toPosition },
  );

  return (
    <g>
      <path
        fill="none"
        stroke={COLORS[DEFAULT_ALGORITHM]}
        strokeWidth={2}
        className={connectionStatus === "valid" ? "" : "animated"}
        d={path}
        markerStart={MarkerType.ArrowClosed}
        markerWidth={25}
        markerEnd={MarkerType.ArrowClosed}
      />
    </g>
  );
}
