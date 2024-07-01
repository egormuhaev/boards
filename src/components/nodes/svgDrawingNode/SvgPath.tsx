import { DrawTools } from "./constants";
import { SvgPathProps } from "./desktop/types";

export function SvgPath({ path, lineColor, lineWidth, tool }: SvgPathProps) {
  return (
    <svg className="h-full w-full">
      <defs>
        <filter id="blur-filter" width="400%" height="400%" x="-200%" y="-200%">
          <feGaussianBlur stdDeviation="0 2" in="SourceGraphic" />
        </filter>
      </defs>
      {/* <g filter="url(#blur-filter)"> */}
      <path
        d={path}
        opacity={tool === DrawTools.Highlighter ? 0.3 : 1}
        stroke={lineColor}
        fill="none"
        strokeWidth={lineWidth}
        strokeLinecap="round"
      />
      {/* </g> */}
    </svg>
  );
}
