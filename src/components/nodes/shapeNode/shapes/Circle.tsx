import { SVGAttributes } from "react";

export type ShapeProps = {
  width: number;
  height: number;
} & SVGAttributes<SVGElement>;

function Circle({ width, height, ...svgAttributes }: ShapeProps) {
  return (
    <ellipse
      cx={width / 2}
      cy={height / 2}
      rx={width / 2}
      ry={height / 2}
      {...svgAttributes}
    />
  );
}

export default Circle;
