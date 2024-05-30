import { Node, Edge } from "reactflow";

export interface ICreateNewNodeBuffer {
  type: string | null;
  fontSize?: number;
  bgColor?: string;
  textColor?: string;
  textAlign?: "center" | "left" | "right";
}

export interface IReactFlowSliceSchema {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: Record<string, React.FC<any>>;
  create: ICreateNewNodeBuffer | null;
  colorsPalet: string[];
}
