import { NodeTypes } from "@/components/nodes";
import { Edge, XYPosition } from "reactflow";

export type HorizontalAlign = "center" | "left" | "right";
export type VerticalAlign = "start" | "center" | "end";

export interface ICreateNewNodeBuffer {
  creatingType: NodeTypes | undefined;
}

export interface IReactFlowSliceSchema {
  // nodes: Node[];
  edges: Edge[];
  // nodeTypes: Record<string, React.FC<any>>;
  // edgeTypes: Record<string, React.FC<any>>;
  buffer: ICreateNewNodeBuffer | null;
  // colorsPalet: string[];
  connectionLinePath: XYPosition[];
  isMovementPlayground: boolean;
}
