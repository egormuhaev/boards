import { Point } from "../types";

export default function calculateNaturalSizeOfDrawing(points: Point[]) {
  const arrayX = points.map(({ x }) => x);
  const arrayY = points.map(({ y }) => y);

  const maxX = Math.max(...arrayX);
  const maxY = Math.max(...arrayY);
  const minX = Math.min(...arrayX);
  const minY = Math.min(...arrayY);

  return [maxX, maxY, minX, minY];
}
