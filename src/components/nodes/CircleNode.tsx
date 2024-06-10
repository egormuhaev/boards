import {
  Handle,
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  useUpdateNodeInternals,
} from "reactflow";
import { useEffect, useRef, useState } from "react";
import ToolbarControlls, { Settings } from "../nodeEnviroment/ToolbarControlls";
import { select } from "d3-selection";
import { drag } from "d3-drag";
import { RotateCw } from "lucide-react";
import Circle from "./shape/Circle";

interface Props extends Settings {
  id: string;
}

const handleStyles = {
  width: 10,
  height: 10,
};

const CircleNode = ({ selected, data, id }: NodeProps<Props>) => {
  const [editText, setEditText] = useState(false);
  const [text, setText] = useState(" ");
  const [rotation, setRotation] = useState(0);

  const textarea = useRef<HTMLDivElement>(null);
  const rotateControlRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();

  const onEditText = (e: React.ChangeEvent<HTMLDivElement>) => {
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
    <div
      className="w-full h-full"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <NodeToolbar isVisible={selected} position={Position.Top} offset={40}>
        <ToolbarControlls
          id={id}
          settings={{
            ...data,
          }}
        />
      </NodeToolbar>
      <NodeResizer
        isVisible={selected}
        minWidth={80}
        minHeight={80}
        keepAspectRatio
      />
      <Handle
        type="source"
        position={Position.Top}
        id={"5"}
        style={{ ...handleStyles, opacity: selected ? 100 : 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={"6"}
        style={{ ...handleStyles, opacity: selected ? 100 : 0 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id={"7"}
        style={{ ...handleStyles, opacity: selected ? 100 : 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={"8"}
        style={{ ...handleStyles, opacity: selected ? 100 : 0 }}
      />

      <div
        ref={rotateControlRef}
        className={`absolute block top-[-30px] left-1/2 -translate-x-1/2 nodrag w-5 h-5`}
      >
        <RotateCw size={16} />
      </div>

      <Circle
        onClick={() => setEditText(false)}
        className="h-full aspect-square flex flex-col justify-center items-center rounded-full min-w-[80px] min-h-[80px] box-border p-2"
        style={{
          backgroundColor: data.bgColor,
        }}
      >
        {editText ? (
          <div
            contentEditable={editText}
            ref={textarea}
            onChange={onEditText}
            onClick={(e) => e.stopPropagation()}
            onBlur={() => setEditText(false)}
            className="flex-1 w-full rounded-full resize-none outline-none break-words text-ellipsis overflow-hidden box-border p-0 m-0 border-none nodrag cursor-text"
            style={{
              backgroundColor: data.bgColor,
              color: data.textColor,
              textAlign: data.horizontalAlign,
              alignContent: data.verticalAlign,
              fontSize: data.fontSize + "px",
              lineHeight: data.fontSize ? data.fontSize + 6 + "px" : undefined,
            }}
          >
            {text}
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setEditText(true);
            }}
            className="flex-1 w-full resize-none rounded-full outline-none break-words text-ellipsis overflow-hidden box-border p-0 m-0 border-none"
            style={{
              backgroundColor: data.bgColor,
              color: data.textColor,
              textAlign: data.horizontalAlign,
              alignContent: data.verticalAlign,
              fontSize: data.fontSize + "px",
              lineHeight: data.fontSize ? data.fontSize + 6 + "px" : undefined,
            }}
          >
            {text}
          </div>
        )}
      </Circle>
    </div>
  );
};

export const circleNodeFlowTypes = "circleNode";

export default CircleNode;
