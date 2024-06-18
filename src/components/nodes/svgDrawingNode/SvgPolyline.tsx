import { useMemo } from "react";
import { SvgPolylineProps } from "./types";

export function SvgPolyline({ points }: SvgPolylineProps) {
  const pointsAsString = useMemo(() => {
    return points.map((p) => `${p.x},${p.y}`).join(" ");
  }, [points]);

  return (
    <svg className="h-full w-full">
      <polyline
        cx={10}
        cy={10}
        className="black"
        opacity={1}
        points={pointsAsString}
        fill="none"
        stroke="blue"
        strokeWidth="2"
      />
    </svg>
  );
}
