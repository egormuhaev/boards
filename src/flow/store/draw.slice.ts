import { createStore, createEvent } from "effector";
import { IDrawSchema } from "./types/draw.schema";
import { DrawTools } from "@/components/nodes/svgDrawingNode/constants";

export const $draw = createStore<IDrawSchema>({
  color: "#000",
  width: 2,
  tool: DrawTools.Pen,
  drawingInThisMoment: false,
  drawingMobileContainer: null,
});

export const changeColor = createEvent<string>();
export const changeWidth = createEvent<number>();
export const changeTool = createEvent<DrawTools>();
export const changeDrawingInThisMoment = createEvent<boolean>();
export const setDrawingMobileContainerId = createEvent<string | null>();

const setDrawingMobileContainerIdReducer = (
  state: IDrawSchema,
  drawingMobileContainer: string | null,
) => {
  return {
    ...state,
    drawingMobileContainer,
  };
};

const changeColorReducer = (state: IDrawSchema, color: string) => {
  return {
    ...state,
    color: color,
  };
};

const changeDrawingInThisMomentReducer = (
  state: IDrawSchema,
  drawingInThisMoment: boolean,
) => {
  return {
    ...state,
    drawingInThisMoment: drawingInThisMoment,
  };
};

const changeToolReducer = (state: IDrawSchema, tool: DrawTools) => {
  return {
    ...state,
    tool: tool,
  };
};

const changeWidthReducer = (state: IDrawSchema, width: number) => {
  return {
    ...state,
    width: width,
  };
};

$draw.on(changeColor, changeColorReducer);
$draw.on(changeWidth, changeWidthReducer);
$draw.on(changeTool, changeToolReducer);
$draw.on(changeDrawingInThisMoment, changeDrawingInThisMomentReducer);
$draw.on(setDrawingMobileContainerId, setDrawingMobileContainerIdReducer);
