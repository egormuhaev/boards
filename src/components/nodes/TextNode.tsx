import {
  Handle,
  HandleType,
  NodeResizer,
  NodeToolbar,
  Position,
  useKeyPress,
  useReactFlow,
  type NodeProps,
} from "reactflow";

import { AlignContent, TextAlign } from "@/flow/store/types/playground.schema";
import { CSSProperties } from "react";
import Content from "./shapeNode/Content";
import ToolbarControlls from "./nodeEnviroment/ToolbarControlls";

export interface TextNodeData extends CSSProperties {
  type: "rectangle";
  color?: string;
  borderWidth?: number;
  textAlign?: TextAlign;
  alignContent?: AlignContent;
  fontSize?: number;
  lineHeight?: number;
  text?: string;
}

const contentCssFormules = {
  width: "90%",
  height: "90%",
};

const resizerHandleStyles = {
  height: "5px",
  width: "5px",
  borderColor: "grey",
  backgroundColor: "grey",
  borderRadius: 0,
};

const resizerLineStyle = {
  borderWidth: "2px",
  borderColor: "grey",
};

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

function TextNode({ id, selected, data }: NodeProps<TextNodeData>) {
  const shiftKeyPressed = useKeyPress("Shift");
  const { setNodes } = useReactFlow();

  const handleStyle = { backgroundColor: data.backgroundColor };

  const onEditText = (e: React.ChangeEvent<Element>) => {
    const value = e.target.textContent;
    updateNode({ text: value || "" });
  };

  const updateNode = (nodePart: Partial<TextNodeData>) =>
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...nodePart,
              },
            }
          : node
      )
    );

  return (
    <div>
      <NodeToolbar isVisible={selected} position={Position.Top} offset={40}>
        <ToolbarControlls id={id} data={data} />
      </NodeToolbar>

      <NodeResizer
        isVisible={selected}
        handleStyle={resizerHandleStyles}
        lineStyle={resizerLineStyle}
        keepAspectRatio={shiftKeyPressed}
      />

      {defaultNodeHandles.map((handle) => (
        <Handle
          key={handle.id}
          style={handleStyle}
          id={handle.id}
          type={handle.type}
          position={handle.position}
        />
      ))}

      <Content
        value={data.text}
        placeholder="Текстовый блок"
        onChange={onEditText}
        style={{
          ...data,
          width: contentCssFormules.width,
          maxHeight: contentCssFormules.height,
          fontSize: data.fontSize + "px",
          lineHeight: data.fontSize ? data.fontSize + 6 + "px" : undefined,
        }}
      />
    </div>
  );
}

export default TextNode;
