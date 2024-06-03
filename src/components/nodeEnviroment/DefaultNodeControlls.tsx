import { Handle, Position, NodeResizer, NodeToolbar } from "reactflow";
import ToolbarControlls, { Settings } from "./ToolbarControlls";
import { memo } from "react";

interface Props extends Settings {
  id: string;
  children: React.ReactNode;
  isSelect: boolean;
  isDrawMode: boolean;
}

const DefaultNodeControlls = ({
  id,
  children,
  isSelect,
  bgColor,
  textColor,
  horizontalAlign,
  verticalAlign,
  fontSize,
}: Props) => {
  return (
    <>
      <NodeToolbar isVisible={isSelect} position={Position.Top}>
        <ToolbarControlls
          id={id}
          settings={{
            bgColor,
            textColor,
            horizontalAlign,
            verticalAlign,
            fontSize,
          }}
        />
      </NodeToolbar>

      <NodeResizer isVisible={isSelect} minWidth={180} minHeight={68} />
      {/* <Handle type="target" position={Position.Top} id={"1"} />
      <Handle type="target" position={Position.Bottom} id={"2"} />
      <Handle type="target" position={Position.Left} id={"3"} />
      <Handle type="target" position={Position.Right} id={"4"} /> */}
      <Handle type="source" position={Position.Top} id={"5"} />
      <Handle type="source" position={Position.Bottom} id={"6"} />
      <Handle type="source" position={Position.Left} id={"7"} />
      <Handle type="source" position={Position.Right} id={"8"} />
      {children}
    </>
  );
};

export default memo(DefaultNodeControlls);
