export interface IFlowSchema {
  isDrawingMode: boolean;
  targetBoard: string;
  nodesIdMap: Record<string, string>;
}
