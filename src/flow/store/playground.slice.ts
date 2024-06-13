import { createStore, createEvent, StoreWritable } from "effector";
import {
  IReactFlowSliceSchema,
  ICreateNewNodeBuffer,
} from "./types/playground.schema";
import { Edge, XYPosition } from "reactflow";

export const $boardPlayground: StoreWritable<IReactFlowSliceSchema> =
  createStore<IReactFlowSliceSchema>({
    edges: [],
    buffer: null,
    isMovementPlayground: false,
    connectionLinePath: [],
  });

export const changeEdge = createEvent<Edge[]>();
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
    buffer,
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

$boardPlayground.on(changeEdge, changeEdgesReducer);
$boardPlayground.on(setCreateBuffer, setCreateBufferReducer);
$boardPlayground.on(setConnectionLinePath, setConnectionLinePathReducer);
$boardPlayground.on(setIsMovementPlayground, setIsMovementPlaygroundReducer);
