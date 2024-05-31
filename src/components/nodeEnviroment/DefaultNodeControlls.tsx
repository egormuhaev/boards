import { Handle, Position, NodeResizer, NodeToolbar } from "reactflow";
import ToolbarControlls, { TextAlign } from "./ToolbarControlls";
import { memo } from "react";

interface Props {
  isSelect: boolean;
  children: React.ReactNode;
  isDrawMode: boolean;
  id: string;
  bgColor: string;
  textColor: string;
  textAlign: TextAlign;
}

const DefaultNodeControlls: React.FC<Props> = ({
  children,
  isSelect,
  bgColor,
  textColor,
  textAlign,
  id,
}) => {
  return (
    <>
      <NodeToolbar isVisible={isSelect} position={Position.Top}>
        <ToolbarControlls
          bgColor={bgColor}
          textColor={textColor}
          textAlign={textAlign}
          id={id}
        />
      </NodeToolbar>

      <NodeResizer isVisible={isSelect} minWidth={180} minHeight={68} />

      <Handle type="target" position={Position.Top} id={"1"} />
      <Handle type="target" position={Position.Bottom} id={"2"} />
      <Handle type="target" position={Position.Left} id={"3"} />
      <Handle type="target" position={Position.Right} id={"4"} />
      <Handle type="source" position={Position.Top} id={"5"} />
      <Handle type="source" position={Position.Bottom} id={"6"} />
      <Handle type="source" position={Position.Left} id={"7"} />
      <Handle type="source" position={Position.Right} id={"8"} />

      {children}
    </>
  );
};

export default memo(DefaultNodeControlls);
