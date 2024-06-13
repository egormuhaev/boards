import { useMemo } from "react";
import { SvgPolylineProps } from "./types";

export function SvgPolyline({ points, isCompletedDrawing }: SvgPolylineProps) {
  const pointsAsString = useMemo(() => {
    return points.map((p) => `${p.x},${p.y}`).join(" ");
  }, [points]);

  return (
    <svg
      style={{
        pointerEvents: !isCompletedDrawing ? "none" : undefined,
      }}
      className="h-full w-full"
    >
      <polyline
        className="bg-opacity-90"
        opacity={0.1}
        pointerEvents="all"
        points={pointsAsString}
        fill="none"
        stroke="blue"
        strokeWidth="10"
      />
    </svg>
  );
}
