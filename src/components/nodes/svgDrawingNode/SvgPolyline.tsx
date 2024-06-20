import { useMemo } from "react";
import { SvgPolylineProps } from "./desktop/types";
import { DrawTools } from "./constants";

export function SvgPolyline({
  points,
  lineColor,
  tool,
  lineWidth,
}: SvgPolylineProps) {
  const pointsAsString = useMemo(() => {
    return points.map((p) => `${p.x},${p.y}`).join(" ");
  }, [points]);

  return (
    <svg className="h-full w-full">
      <polyline
        opacity={tool === DrawTools.Highlighter ? 0.3 : 1}
        points={pointsAsString}
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
      />
    </svg>
  );
}
