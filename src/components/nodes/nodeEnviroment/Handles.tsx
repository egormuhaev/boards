import { CSSProperties } from "react";
import { Handle, HandleType, Position } from "reactflow";

const defaultNodeHandles: {
  id: string;
  type: HandleType;
  position: Position;
}[] = [
  {
    id: "top",
    type: "source",
    position: Position.Top,
  },
  {
    id: "right",
    type: "source",
    position: Position.Right,
  },
  {
    id: "bottom",
    type: "source",
    position: Position.Bottom,
  },
  {
    id: "left",
    type: "source",
    position: Position.Left,
  },
];

const Handles = ({ handleStyle }: { handleStyle: CSSProperties }) => {
  return (
    <>
      {defaultNodeHandles.map((handle) => (
        <Handle
          key={handle.id}
          style={handleStyle}
          id={handle.id}
          type={handle.type}
          position={handle.position}
        />
      ))}
    </>
  );
};

export default Handles;
