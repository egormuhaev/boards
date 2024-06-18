import { Point } from "../types";

export default function normalizationSvgOffset(
  minX: number,
  minY: number,
  points: Point[],
): Point[] {
  return points.map((point: Point) => {
    return {
      x: point.x - minX,
      y: point.y - minY,
    };
  });
}
