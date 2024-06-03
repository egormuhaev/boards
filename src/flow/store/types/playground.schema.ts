import { Node, Edge } from "reactflow";

export type HorizontalAlign = "center" | "left" | "right";
export type VerticalAlign = "start" | "center" | "end";

export interface ICreateNewNodeBuffer {
  type: string | null;
  fontSize?: number;
  bgColor?: string;
  textColor?: string;
  horizontalAlign?: HorizontalAlign;
  verticalAlign?: VerticalAlign;
}

export interface IReactFlowSliceSchema {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: Record<string, React.FC<any>>;
  create: ICreateNewNodeBuffer | null;
  colorsPalet: string[];
}
