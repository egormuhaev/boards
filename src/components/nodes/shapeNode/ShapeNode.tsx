import {
  NodeResizer,
  type NodeProps,
  useStore,
  Handle,
  Position,
  useKeyPress,
  useUpdateNodeInternals,
  NodeToolbar,
} from "reactflow";

import Shape, { ShapeType } from "./Shape";
import Content from "./Content";
import { select } from "d3-selection";
import { useEffect, useRef, useState } from "react";
import { drag } from "d3-drag";
import {
  HorizontalAlign,
  VerticalAlign,
} from "@/flow/store/types/playground.schema";
import { RotateCw } from "lucide-react";
import { Circle, Rectangle } from "./shapes";
import ToolbarControlls from "../nodeEnviroment/ToolbarControlls";

export type ShapeNodeData = {
  type: ShapeType;
  color: string;
  horizontalAlign?: HorizontalAlign;
  verticalAlign?: VerticalAlign;
  textColor?: string;
  bgColor?: string;
  fontSize?: number;
  rotation?: string;
  text?: string;
};

function useNodeDimensions(id: string) {
  const node = useStore((state) => state.nodeInternals.get(id));
  return {
    width: node?.width || 0,
    height: node?.height || 0,
  };
}

// При добавлении новой фигуры нужно добавить ее в ShapeComponents; И написать формулу для ее высоты и ширины в contentCssFormules

export const ShapeComponents = {
  circle: Circle,
  rectangle: Rectangle,
};

const contentCssFormules: Record<
  keyof typeof ShapeComponents,
  { width: string; height: string }
> = {
  circle: {
    width: "calc(90% / sqrt(2))",
    height: "calc(90% / sqrt(2))",
  },
  rectangle: {
    width: "100%",
    height: "100%",
  },
};

function ShapeNode({ id, selected, data }: NodeProps<ShapeNodeData>) {
  const { bgColor, type } = data;

  const { width, height } = useNodeDimensions(id);
  const shiftKeyPressed = useKeyPress("Shift");
  const handleStyle = { backgroundColor: bgColor };

  const [editText, setEditText] = useState(false);
  const [text, setText] = useState(data.text || "");
  const [rotation, setRotation] = useState(0);

  const textarea = useRef<HTMLDivElement>(null);
  const rotateControlRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();

  const onEditText = (e: React.ChangeEvent<Element>) => {
    const value = e.target.innerHTML;
    setText(value);
  };

  useEffect(() => {
    if (!rotateControlRef.current) {
      return;
    }

    const selection = select(rotateControlRef.current);
    const dragHandler = drag().on("drag", (evt) => {
      const dx = evt.x - 100;
      const dy = evt.y - 100;
      const rad = Math.atan2(dx, dy);
      const deg = rad * (180 / Math.PI);
      setRotation(180 - deg);
      updateNodeInternals(id);
    });

    selection.call(dragHandler as any);
  }, [id, updateNodeInternals]);

  useEffect(() => {
    if (editText) {
      textarea.current?.focus();
    } else {
      textarea.current?.blur();
    }
  }, [editText]);

  return (
    <div style={{ transform: `rotate(${rotation}deg)` }}>
      <NodeToolbar isVisible={selected} position={Position.Top} offset={40}>
        <ToolbarControlls
          id={id}
          settings={{
            ...data,
          }}
        />
      </NodeToolbar>
      <NodeResizer
        color={bgColor}
        keepAspectRatio={shiftKeyPressed}
        isVisible={selected}
      />
      <Shape
        type={type}
        width={width}
        height={height}
        fill={bgColor}
        strokeWidth={2}
        stroke={bgColor}
      />
      <Handle
        style={handleStyle}
        id="top"
        type="source"
        position={Position.Top}
      />
      <Handle
        style={handleStyle}
        id="right"
        type="source"
        position={Position.Right}
      />
      <Handle
        style={handleStyle}
        id="bottom"
        type="source"
        position={Position.Bottom}
      />
      <Handle
        style={handleStyle}
        id="left"
        type="source"
        position={Position.Left}
      />
      <div
        ref={rotateControlRef}
        className={`${
          !selected && "hidden"
        } absolute block top-[-30px] left-1/2 -translate-x-1/2 nodrag w-5 h-5`}
      >
        <RotateCw size={16} />
      </div>
      <Content
        value={text}
        active={editText}
        ref={textarea}
        onChange={onEditText}
        changeActive={setEditText}
        style={{
          width: contentCssFormules[type].width,
          height: contentCssFormules[type].height,
          backgroundColor: data.bgColor,
          color: data.textColor,
          textAlign: data.horizontalAlign,
          alignContent: data.verticalAlign,
          fontSize: data.fontSize + "px",
          lineHeight: data.fontSize ? data.fontSize + 6 + "px" : undefined,
        }}
      />
    </div>
  );
}

export default ShapeNode;
