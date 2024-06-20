import type { Point } from "../types";

export default function smoothPolyline(points: Point[]): string {
  if (points.length < 2) {
    return "";
  }
  const pathData: string[] = [];
  pathData.push(`M ${points[0].x},${points[0].y}`);

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];

    const controlPointX = (p0.x + p1.x) / 2;
    const controlPointY = (p0.y + p1.y) / 2;

    pathData.push(`Q ${p0.x},${p0.y} ${controlPointX},${controlPointY}`);
  }

  pathData.push(
    `T ${points[points.length - 1].x},${points[points.length - 1].y}`,
  );

  return pathData.join(" ");
}
