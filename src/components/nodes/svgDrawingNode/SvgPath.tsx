import { SvgPathProps } from "./types";

export function SvgPath({ path }: SvgPathProps) {
  return (
    <svg className="h-full w-full">
      <path
        className="black"
        d={path}
        opacity={1}
        stroke="blue"
        fill="none"
        strokeWidth="2"
      />
    </svg>
  );
}
