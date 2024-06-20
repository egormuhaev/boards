import { ShapeProps } from "./types";

function Rectangle({ width, height, children, ...svgAttributes }: ShapeProps) {
  return (
    <rect x={0} y={0} width={width} height={height} {...svgAttributes}>
      {children}
    </rect>
  );
}

export default Rectangle;
