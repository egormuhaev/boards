import { Point } from "../types";

export default function normalizationSvgOffset(
  minX: number,
  minY: number,
  points: Point[],
  lineWidth: number,
): Point[] {
  return points.map((point: Point) => {
    return {
      x: point.x - minX + lineWidth,
      y: point.y - minY + lineWidth,
    };
  });
}
