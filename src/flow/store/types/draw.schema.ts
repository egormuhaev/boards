import { DrawTools } from "@/components/nodes/svgDrawingNode/constants";

export interface IDrawSchema {
  color: string;
  width: number;
  tool: DrawTools;
}
