import { DrawTools } from "@/components/nodes/svgDrawingNode/constants";

export interface IDrawSchema {
  color: string;
  width: number;
  tool: DrawTools;
  drawingInThisMoment: boolean;
  drawingMobileContainer: string | null;
}
