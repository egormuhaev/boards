import { NodeTypes } from "@/components/nodes";
import { Edge, XYPosition } from "reactflow";

export type HorizontalAlign = "center" | "left" | "right";
export type VerticalAlign = "start" | "center" | "end";

export interface ICreateNewNodeBuffer {
  creatingType: NodeTypes | undefined;
}

export interface IReactFlowSliceSchema {
  edges: Edge[];
  buffer: ICreateNewNodeBuffer | null;
  connectionLinePath: XYPosition[];
  isMovementPlayground: boolean;
  theme: string;
}
