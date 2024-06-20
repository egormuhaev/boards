import { Handle, NodeProps, NodeResizer, Position } from "reactflow";
import { Settings } from "./nodeEnviroment/ToolbarControlls";

interface Props extends Settings {
  id: string;
  file: File;
}

const PictureNode = ({ selected, data }: NodeProps<Props>) => {
  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={180}
        minHeight={68}
        keepAspectRatio
      />
      <Handle type="source" position={Position.Top} id={"0"} />
      <Handle type="source" position={Position.Bottom} id={"1"} />
      <Handle type="source" position={Position.Left} id={"2"} />
      <Handle type="source" position={Position.Right} id={"3"} />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-full flex flex-col justify-center items-center rounded-md min-w-[180px] min-h-[68px] box-border bg-transparent"
      >
        <img
          src={data.file.name}
          alt="img"
          className="w-full h-full cursor-grab"
        />
      </div>
    </>
  );
};

export const pictureFlowTypes = "pictureFlow";

export default PictureNode;
