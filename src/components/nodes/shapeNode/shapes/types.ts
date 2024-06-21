import { SVGAttributes } from "react";

export type ShapeProps = {
  width: number;
  height: number;
} & SVGAttributes<SVGElement>;
