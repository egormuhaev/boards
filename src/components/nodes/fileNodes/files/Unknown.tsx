import { FaFile } from "react-icons/fa";

const Unknown = ({ file }: { file: File }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex justify-center items-center box-border bg-transparent gap-3"
    >
      <FaFile size={50} color="black" />

      <div className="flex flex-col">
        <p className="text-slate-500 text-xl text-start items-center">
          {file.name}
        </p>
        <button className="text-slate-500 text-xl text-start items-center">
          Скачать
        </button>
      </div>
    </div>
  );
};

export default Unknown;
