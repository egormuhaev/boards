import { createStore, createEvent } from "effector";
import { Edge, Node } from "reactflow";
import {
  IReactFlowSliceSchema,
  ICreateNewNodeBuffer,
} from "./types/playground.schema";
import CanvasNode from "@/components/nodes/canvasNode";
import RectTextNode from "@/components/nodes/RectTextNode";
import { v4 } from "uuid";
import { NodeTypes } from "@/components";
import { randomColor } from "../utils/randomColor";
import Text from "@/components/nodes/Text";

export const $boardPlayground = createStore<IReactFlowSliceSchema>({
  nodes: [],
  edges: [],
  nodeTypes: {
    [NodeTypes.CanvasNodeFlowTypes]: CanvasNode,
    [NodeTypes.RectTextNodeFlowTypes]: RectTextNode,
    [NodeTypes.TextNodeFlowTypes]: Text,
  },
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
        data: state.create,
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
    edges: edges,
  };
};

$boardPlayground.on(changeNode, changeNodesReducer);
$boardPlayground.on(changeEdge, changeEdgesReducer);
$boardPlayground.on(addNewNode, addNewNodeReducer);
$boardPlayground.on(setCreateBuffer, setCreateBufferReducer);
