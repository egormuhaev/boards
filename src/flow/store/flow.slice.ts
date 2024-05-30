import { createStore, createEvent } from "effector";
import { IFlowSchema } from "./types/flow.schema";

export const $flow = createStore<IFlowSchema>({
  isDrawingMode: false,
});

export const changeDrawingMode = createEvent<boolean>();

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
