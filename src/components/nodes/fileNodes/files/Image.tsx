import { FileNodeData } from "../FileNode";

const Image = ({ filePath, fileName }: FileNodeData) => {
  console.log(fileName, filePath);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative h-full w-full flex flex-col justify-center items-center rounded-md min-w-[180px] min-h-[68px] box-border bg-transparent"
    >
      <img
        src={filePath}
        alt={fileName}
        className="w-full h-full cursor-grab"
      />
    </div>
  );
};

export default Image;
