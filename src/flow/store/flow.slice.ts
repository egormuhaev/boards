import { createStore, createEvent } from "effector";
import { IFlowSchema } from "./types/flow.schema";

export const $flow = createStore<IFlowSchema>({
  isDrawingMode: false,
  targetBoard: "clxlirvxg0000ru4lc4sevksl",
  nodesIdMap: {},
  edgesIdMap: {},
});

export const changeDrawingMode = createEvent<boolean>();
export const setNodesIdMap = createEvent<Record<string, string>>();
export const setEdgesIdMap = createEvent<Record<string, string>>();

const setNodesIdMapReducer = (
  state: IFlowSchema,
  nodesIdMap: Record<string, string>,
): IFlowSchema => {
  return {
    ...state,
    nodesIdMap: { ...nodesIdMap },
  };
};

const setEdgesIdMapReducer = (
  state: IFlowSchema,
  edgesIdMap: Record<string, string>,
): IFlowSchema => {
  return {
    ...state,
    edgesIdMap: { ...edgesIdMap },
  };
};

const updateDrawingModeReducer = (
  state: IFlowSchema,
  isDrawing: boolean,
): IFlowSchema => {
  return {
    ...state,
    isDrawingMode: isDrawing,
  };
};

$flow.on(changeDrawingMode, updateDrawingModeReducer);
$flow.on(setNodesIdMap, setNodesIdMapReducer);
$flow.on(setEdgesIdMap, setEdgesIdMapReducer);
