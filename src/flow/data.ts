import { NodeTypes } from "@/components";
import { EdgeTypes } from "@/components/egdes";
import { EditableEdge } from "@/components/egdes/EditableEdge";
import {
  VideoNode,
  CanvasNode,
  CircleNode,
  FileNode,
  PDFNode,
  PictureNode,
  RectangleNode,
  TextNode,
} from "@/components/nodes";

export const nodeTypes = {
  [NodeTypes.CanvasNodeFlowTypes]: CanvasNode,
  [NodeTypes.RectangleNodeFlowTypes]: RectangleNode,
  [NodeTypes.CircleNodeFlowTypes]: CircleNode,
  [NodeTypes.TextNodeFlowTypes]: TextNode,
  [NodeTypes.VideoNodeFlowTypes]: VideoNode,
  [NodeTypes.FileNodeFlowTypes]: FileNode,
  [NodeTypes.PictureNodeFlowTypes]: PictureNode,
  [NodeTypes.PDFNodeFlowTypes]: PDFNode,
};

export const edgeTypes = {
  [EdgeTypes.EditableEdgeFlowTypes]: EditableEdge,
};

export const fileTypes: Record<string, NodeTypes> = {
  pdf: NodeTypes.PDFNodeFlowTypes,
  jpeg: NodeTypes.PictureNodeFlowTypes,
  jpg: NodeTypes.PictureNodeFlowTypes,
  png: NodeTypes.PictureNodeFlowTypes,
  mov: NodeTypes.VideoNodeFlowTypes,
  mp4: NodeTypes.VideoNodeFlowTypes,
  webm: NodeTypes.VideoNodeFlowTypes,
};

export const defaultNodeData = {
  horizontalAlign: "center",
  verticalAlign: "center",
  textColor: "black",
  bgColor: "gray",
  fontSize: 14,
  rotation: 0,
};

export const colorsPalet = [
  "8ecae6",
  "219ebc",
  "023047",
  "cdb4db",
  "ffc8dd",
  "ffafcc",
  "bde0fe",
  "a2d2ff",
  "ffbe0b",
  "fb5607",
  "ff006e",
  "8338ec",
  "3a86ff",
  "9b5de5",
  "f15bb5",
  "fee440",
  "00bbf9",
  "00f5d4",
];
