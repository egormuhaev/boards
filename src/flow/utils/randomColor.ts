import useUndoRedo from "@/hooks/useUndoRedo";
import { DragEvent, RefObject } from "react";

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomColor = (colors: string[]) => {
  return "#" + colors[getRandomInt(0, colors.length - 1)];
};

export const clearInput = <T extends HTMLInputElement>(ref: RefObject<T>) => {
  if (ref.current) ref.current.value = "";
};

//FIXME: при отмене выбора промис зависает, потому что не срабатывает функция onChange
export const selectFiles = <T extends HTMLInputElement>(
  ref: RefObject<T>
): Promise<FileList | null> => {
  return new Promise((resolve) => {
    if (ref.current) {
      ref.current.onchange = (event) => {
        const files = (event.target as HTMLInputElement).files;

        resolve(files);
      };
      ref.current.click();
    } else {
      resolve(null);
    }
  });
};

export const handleDragEvent = (e: DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
};
