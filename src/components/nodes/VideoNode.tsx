import { Handle, NodeProps, NodeResizer, Position } from "reactflow";
import { Settings } from "../nodeEnviroment/ToolbarControlls";

interface Props extends Settings {
  id: string;
  file: File;
}

const VideoNode = ({ selected, data }: NodeProps<Props>) => {
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
        <p className="absolute top-5 left-5 text-white text-xl">
          {data.file.name}
        </p>

        <video controls width="250" className="w-full h-full cursor-grab">
          <source src={data.file.name} />
        </video>
      </div>
    </>
  );
};

export const videoFlowTypes = "videoFlow";

export default VideoNode;
