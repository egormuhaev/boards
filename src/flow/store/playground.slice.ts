import { createStore, createEvent, StoreWritable } from "effector";
import { Edge, Node, XYPosition } from "reactflow";
import {
  IReactFlowSliceSchema,
  ICreateNewNodeBuffer,
} from "./types/playground.schema";
import CanvasNode from "@/components/nodes/CanvasNode";
import { v4 } from "uuid";
import { NodeTypes } from "@/components";
import { randomColor } from "../utils/randomColor";
import { EdgeTypes } from "@/components/egdes";
import { EditableEdge } from "@/components/egdes/EditableEdge";
import VideoNode from "@/components/nodes/VideoNode";
import FileNode from "@/components/nodes/FileNode";
import PictureNode from "@/components/nodes/PictureNode";
import RectangleNode from "@/components/nodes/RectangleNode";
import TextNode from "@/components/nodes/TextNode";
import PDFNode from "@/components/nodes/PDFNode";

export const $boardPlayground: StoreWritable<IReactFlowSliceSchema> =
  createStore<IReactFlowSliceSchema>({
    nodes: [],
    edges: [],
    nodeTypes: {
      [NodeTypes.CanvasNodeFlowTypes]: CanvasNode,
      [NodeTypes.RectangleNodeFlowTypes]: RectangleNode,
      [NodeTypes.TextNodeFlowTypes]: TextNode,
      [NodeTypes.VideoNodeFlowTypes]: VideoNode,
      [NodeTypes.FileNodeFlowTypes]: FileNode,
      [NodeTypes.PictureNodeFlowTypes]: PictureNode,
      [NodeTypes.PDFNodeFlowTypes]: PDFNode,
    },

    edgeTypes: {
      [EdgeTypes.EditableEdgeFlowTypes]: EditableEdge,
    },

    isMovementPlayground: false,

    connectionLinePath: [],
    create: null,
    colorsPalet: [
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
    ],
  });

export const changeNode = createEvent<Node[]>();
export const changeEdge = createEvent<Edge[]>();
export const addNewNode = createEvent<Omit<Node, "id">>();
export const setCreateBuffer = createEvent<ICreateNewNodeBuffer>();
export const setConnectionLinePath = createEvent<XYPosition[]>();
export const setIsMovementPlayground = createEvent<boolean>();

const setIsMovementPlaygroundReducer = (
  state: IReactFlowSliceSchema,
  isMovementPlayground: boolean
): IReactFlowSliceSchema => {
  return {
    ...state,
    isMovementPlayground: isMovementPlayground,
  };
};

const setConnectionLinePathReducer = (
  state: IReactFlowSliceSchema,
  connectionLinePath: XYPosition[]
): IReactFlowSliceSchema => {
  return {
    ...state,
    connectionLinePath: connectionLinePath,
  };
};

const setCreateBufferReducer = (
  state: IReactFlowSliceSchema,
  buffer: ICreateNewNodeBuffer
): IReactFlowSliceSchema => {
  return {
    ...state,
    create: {
      ...buffer,
      bgColor: buffer.bgColor ?? randomColor(state.colorsPalet),
      textColor: buffer.textColor ?? randomColor(state.colorsPalet),
      horizontalAlign: buffer.horizontalAlign ?? "center",
      verticalAlign: buffer.verticalAlign ?? "center",
      fontSize: buffer.fontSize ?? 14,
      rotation: buffer.rotation ?? 0,
    },
  };
};

const addNewNodeReducer = (
  state: IReactFlowSliceSchema,
  node: Omit<Node, "id">
): IReactFlowSliceSchema => {
  return {
    ...state,
    nodes: [
      ...state.nodes,
      {
        ...node,
        id: v4(),
        data: { ...state.create, ...node.data },
      },
    ],
    create: null,
  };
};

const changeNodesReducer = (
  state: IReactFlowSliceSchema,
  nodes: Node[]
): IReactFlowSliceSchema => {
  return {
    ...state,
    nodes: [...nodes],
  };
};

const changeEdgesReducer = (
  state: IReactFlowSliceSchema,
  edges: Edge[]
): IReactFlowSliceSchema => {
  return {
    ...state,
    isMovementPlayground: true,
    edges: [...edges],
  };
};

$boardPlayground.on(changeNode, changeNodesReducer);
$boardPlayground.on(changeEdge, changeEdgesReducer);
$boardPlayground.on(addNewNode, addNewNodeReducer);
$boardPlayground.on(setCreateBuffer, setCreateBufferReducer);
$boardPlayground.on(setConnectionLinePath, setConnectionLinePathReducer);
$boardPlayground.on(setIsMovementPlayground, setIsMovementPlaygroundReducer);
