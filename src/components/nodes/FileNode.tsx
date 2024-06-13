import { Handle, NodeProps, Position } from "reactflow";
import { Settings } from "./nodeEnviroment/ToolbarControlls";
import { FaFile } from "react-icons/fa";

interface Props extends Settings {
  id: string;
  file: File;
}

const FileNode = ({ data }: NodeProps<Props>) => {
  return (
    <>
      <Handle type="source" position={Position.Top} id={"0"} />
      <Handle type="source" position={Position.Bottom} id={"1"} />
      <Handle type="source" position={Position.Left} id={"2"} />
      <Handle type="source" position={Position.Right} id={"3"} />

      <div
        onClick={(e) => e.stopPropagation()}
        className="flex justify-center items-center box-border bg-transparent gap-3"
      >
        <FaFile size={50} color="black" />

        <div className="flex flex-col">
          <p className="text-slate-500 text-xl text-start items-center">
            {data.file.name}
          </p>
          <button className="text-slate-500 text-xl text-start items-center">
            Скачать
          </button>
        </div>
      </div>
    </>
  );
};

export const fileFlowTypes = "fileFlow";

export default FileNode;
