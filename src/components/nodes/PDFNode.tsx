import { Handle, NodeProps, Position } from "reactflow";
import { Settings } from "./nodeEnviroment/ToolbarControlls";

interface Props extends Settings {
  id: string;
  file: File;
}

const PDFNode = ({ data }: NodeProps<Props>) => {
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
        <iframe
          id="pdf-js-viewer"
          src={`/src/web/viewer.html?file=/public/${data.file.name}`}
          title="webviewer"
          width="500"
          height="600"
        ></iframe>
      </div>
    </>
  );
};

export const pdfFlowTypes = "pdfFlow";

export default PDFNode;
