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
export const selectFiles = async <T extends HTMLInputElement>(
  ref: RefObject<T>
) => {
  const files: FileList | null = await new Promise((resolve) => {
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

  if (!files?.length) return;

  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  const response = await fetch("http://localhost:3000/api/files", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result = await response.json();
  console.log(result);
  return result.files;
};

export const handleDragEvent = (e: DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
};
