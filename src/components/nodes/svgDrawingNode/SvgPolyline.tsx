import { useMemo } from "react";
import { SvgPolylineProps } from "./types";

export function SvgPolyline({
  points,
  lineColor,
  lineWidth,
}: SvgPolylineProps) {
  const pointsAsString = useMemo(() => {
    return points.map((p) => `${p.x},${p.y}`).join(" ");
  }, [points]);

  return (
    <svg className="h-full w-full">
      <polyline
        cx={2}
        cy={2}
        opacity={1}
        points={pointsAsString}
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
      />
    </svg>
  );
}
