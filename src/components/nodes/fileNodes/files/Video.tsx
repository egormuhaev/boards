import { FileNodeData } from "../FileNode";

const Video = ({ fileName, filePath }: FileNodeData) => {
  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-full flex flex-col justify-center items-center rounded-md min-w-[180px] min-h-[68px] box-border bg-transparent"
      >
        <p className="absolute top-5 left-5 text-white text-xl">{fileName}</p>

        <video controls width="250" className="w-full h-full cursor-grab">
          <source src={filePath} />
        </video>
      </div>
    </>
  );
};

export default Video;
