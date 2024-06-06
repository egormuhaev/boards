import { Node, Edge, XYPosition } from "reactflow";

export type HorizontalAlign = "center" | "left" | "right";
export type VerticalAlign = "start" | "center" | "end";

export interface ICreateNewNodeBuffer {
  type: string | null;
  fontSize?: number;
  bgColor?: string;
  textColor?: string;
  horizontalAlign?: HorizontalAlign;
  verticalAlign?: VerticalAlign;
  rotation?: number;
}

export interface IReactFlowSliceSchema {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: Record<string, React.FC<any>>;
  edgeTypes: Record<string, React.FC<any>>;
  create: ICreateNewNodeBuffer | null;
  colorsPalet: string[];
  connectionLinePath: XYPosition[];
  isMovementPlayground: boolean;
}
