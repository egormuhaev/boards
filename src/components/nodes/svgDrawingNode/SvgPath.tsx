import { SvgPathProps } from "./types";

export function SvgPath({ path, isCompletedDrawing }: SvgPathProps) {
  return (
    <svg
      style={{
        pointerEvents: !isCompletedDrawing ? "none" : undefined,
      }}
      className="h-full w-full"
    >
      <path
        className="black"
        d={path}
        opacity={1}
        pointerEvents="all"
        stroke="blue"
        fill="none"
        strokeWidth="2"
      />
    </svg>
  );
}
