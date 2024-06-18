import { Handle, Position } from "reactflow";

export function SvgDrawingNodeHandle({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <>
        <Handle type="source" position={Position.Top} id={"0"} />
        <Handle type="source" position={Position.Bottom} id={"1"} />
        <Handle type="source" position={Position.Left} id={"2"} />
        <Handle type="source" position={Position.Right} id={"3"} />
      </>
    );
  }

  return null;
}
