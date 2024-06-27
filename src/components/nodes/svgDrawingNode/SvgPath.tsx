import { DrawTools } from "./constants";
import { SvgPathProps } from "./desktop/types";

export function SvgPath({ path, lineColor, lineWidth, tool }: SvgPathProps) {
  return (
    <svg className="h-full w-full">
      <path
        d={path}
        opacity={tool === DrawTools.Highlighter ? 0.3 : 1}
        stroke={lineColor}
        fill="none"
        strokeWidth={lineWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
