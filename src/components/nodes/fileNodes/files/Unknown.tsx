import { FileNodeData } from "../FileNode";
import { ArrowDownToLine } from "lucide-react";

export const downloadFile = async (filePath: string, fileName: string) => {
  const response = await fetch(filePath);
  if (!response.ok) {
    alert("Не удалось загрузить файл! Возможно он был удален.");
    return;
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = fileName;

  link.click();
};

const Unknown = ({ filePath, fileName, fileSize }: FileNodeData) => {
  const transformedSize = (+fileSize / 1024).toFixed(2) + " КБ";

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="h-full flex justify-center items-center gap-3 bg-black text-white p-5 box-border rounded-full overflow-hidden text-lg"
    >
      <button
        onClick={() => downloadFile(filePath, fileName)}
        className="bg-white rounded-full h-full min-h-10 max-h-28 aspect-square flex justify-center items-center hover:cursor-pointer"
      >
        <ArrowDownToLine size={28} color="black" />
      </button>

      <div className="flex-1">
        <span>{fileName}</span>
        <div className="flex text-start items-end gap-2">
          <span>{transformedSize}</span>
        </div>
      </div>
    </div>
  );
};

export default Unknown;
