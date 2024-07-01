import { CustomFile } from "@/components/nodes/fileNodes/files/types";
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
export const selectFiles = async () => {
  const input = document.createElement("input");

  input.multiple;
  input.type = "file";
  input.onchange;

  const files: FileList | null = await new Promise((resolve) => {
    input.oninput = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (!files) {
        resolve(null);
      }

      resolve(files);
    };

    input.click();
  });

  return await uploadFiles(files);
};

export const uploadFiles = async (
  files: FileList | null,
): Promise<CustomFile[] | null> => {
  if (!files?.length) return null;

  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  const response = await fetch("http://localhost:3001/api/files", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const result = await response.json();

  return result.files || null;
};

export const handleDragEvent = (e: DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
};
