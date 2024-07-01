import { XYPosition } from "reactflow";

export default function getNativeTouchScreenCoordinate(
  e: TouchEvent,
  ref: React.RefObject<HTMLDivElement>,
  screenToFlowPosition: (pos: XYPosition) => XYPosition,
) {
  if (ref.current) {
    const rect = ref.current.getBoundingClientRect();

    const targetRect = screenToFlowPosition({
      x: rect.x,
      y: rect.y,
    });

    const touch = screenToFlowPosition({
      x: e.targetTouches[0].clientX!,
      y: e.targetTouches[0].clientY!,
    });

    return {
      x: touch.x - targetRect.x,
      y: touch.y - targetRect.y,
    };
  }

  return {
    x: 0,
    y: 0,
  };
}
