import { SvgPathProps } from "./types";

export function SvgPath({ path, lineColor, lineWidth }: SvgPathProps) {
  return (
    <svg className="h-full w-full">
      <path
        className="black"
        d={path}
        opacity={1}
        stroke={lineColor}
        fill="none"
        strokeWidth={lineWidth}
      />
    </svg>
  );
}
