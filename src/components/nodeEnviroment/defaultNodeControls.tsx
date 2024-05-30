import { Handle, Position, NodeResizer, NodeToolbar } from "reactflow";
import ToolbarControlls from "./toolbar";

interface Props {
  isSelect: boolean;
  children: React.ReactNode;
  isDrawMode: boolean;
  id: string;
  bgColor: string;
}

const DefaultNodeControlls: React.FC<Props> = ({
  children,
  isSelect,
  bgColor,
  id,
}) => {
  return (
    <>
      <NodeResizer isVisible={isSelect} minWidth={180} minHeight={68} />
      <Handle type="source" position={Position.Top} id={"1"} />
      <Handle type="target" position={Position.Bottom} id={"2"} />
      <Handle type="target" position={Position.Left} id={"3"} />
      <Handle type="target" position={Position.Right} id={"4"} />
      <Handle type="source" position={Position.Top} id={"5"} />
      <Handle type="source" position={Position.Bottom} id={"6"} />
      <Handle type="source" position={Position.Left} id={"7"} />
      <Handle type="source" position={Position.Right} id={"8"} />
      <NodeToolbar isVisible={isSelect} position={Position.Top}>
        <ToolbarControlls bgColor={bgColor} id={id} />
      </NodeToolbar>
      {children}
    </>
  );
};

export default DefaultNodeControlls;
