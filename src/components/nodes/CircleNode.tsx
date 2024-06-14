import {
  Handle,
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  useUpdateNodeInternals,
} from "reactflow";
import React, {
  CSSProperties,
  ChangeEvent,
  MouseEvent,
  Ref,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import ToolbarControlls, { Settings } from "./nodeEnviroment/ToolbarControlls";
import { select } from "d3-selection";
import { drag } from "d3-drag";
import { RotateCw } from "lucide-react";
import { Circle } from "./shape";
import useUndoRedo from "@/hooks/useUndoRedo";

interface Props extends Settings {
  id: string;
}

const handleStyles = {
  width: 10,
  height: 10,
};

const CircleNode = ({ selected, data, id }: NodeProps<Props>) => {
  const [editText, setEditText] = useState(false);
  const [text, setText] = useState("");
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
        minWidth={180}
        minHeight={180}
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
        className={`${
          !selected && "hidden"
        } absolute block top-[-30px] left-1/2 -translate-x-1/2 nodrag w-5 h-5`}
      >
        <RotateCw size={16} />
      </div>

      <Circle
        style={{
          backgroundColor: data.bgColor,
        }}
      >
        <div
          style={{
            width: "calc(100% / sqrt(2))",
            height: "calc(100% / sqrt(2))",
          }}
        >
          <Editable
            value={text}
            active={editText}
            ref={textarea}
            onChange={onEditText}
            changeActive={setEditText}
            style={{
              backgroundColor: data.bgColor,
              color: data.textColor,
              textAlign: data.horizontalAlign,
              alignContent: data.verticalAlign,
              fontSize: data.fontSize + "px",
              lineHeight: data.fontSize ? data.fontSize + 6 + "px" : undefined,
            }}
          />
        </div>
      </Circle>
    </div>
  );
};

export const circleNodeFlowTypes = "circleNode";

export default CircleNode;

interface EditableProps {
  active: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<Element>) => void;
  changeActive: (bool: boolean) => void;
  style: CSSProperties;
}

export const Editable = forwardRef<HTMLDivElement, EditableProps>(
  ({ active, value, onChange, changeActive, style }, ref) => {
    const onClick = (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!active) changeActive(true);
    };

    const { takeSnapshot } = useUndoRedo();

    return (
      <div
        contentEditable={active}
        ref={ref}
        onChange={(e) => {
          takeSnapshot();
          onChange(e as unknown as ChangeEvent);
        }}
        onClick={onClick}
        onBlur={() => changeActive(false)}
        className={`flex-1 w-full h-full resize-none bg-transparent outline-none break-words text-ellipsis overflow-hidden box-border p-0 m-0 border-none ${
          active ? "nodrag cursor-text" : ""
        }`}
        style={style}
      >
        {value || <br />}
      </div>
    );
  }
);
