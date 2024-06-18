import type { PlotSize } from "../types";

export default function resizeSVGContainer(
  x: number,
  y: number,
  plotSize: PlotSize,
): PlotSize | null {
  const threshold = 300;
  const increment = 500;

  const { width, height } = plotSize;
  let newWidth = width;
  let newHeight = height;

  if (x >= width - threshold) newWidth += increment;
  if (x <= threshold) newWidth += increment;
  if (y >= height - threshold) newHeight += increment;
  if (y <= threshold) newHeight += increment;

  if (newWidth !== width || newHeight !== height) {
    return { width: newWidth, height: newHeight };
  }

  return null;
}
