import { createStore, createEvent } from "effector";
import { IDrawSchema } from "./types/draw.schema";

export const $draw = createStore<IDrawSchema>({
  color: "#000",
  width: 2,
});

export const changeColor = createEvent<string>();
export const changeWidth = createEvent<number>();

const changeColorReducer = (state: IDrawSchema, color: string) => {
  return {
    ...state,
    color: color,
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
