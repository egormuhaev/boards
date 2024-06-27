import {
  Handle,
  HandleType,
  NodeResizer,
  NodeToolbar,
  Position,
  useKeyPress,
  useReactFlow,
  useStore,
  useUpdateNodeInternals,
  useViewport,
  type NodeProps,
} from "reactflow";

import { AlignContent, TextAlign } from "@/flow/store/types/playground.schema";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { RotateCw } from "lucide-react";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ToolbarControlls from "../nodeEnviroment/ToolbarControlls";
import Shape, { ShapeComponents, ShapeType } from "./Shape";
import useUndoRedo from "@/hooks/useUndoRedo";
import ContentEditable from "./Content";
import Handles from "../nodeEnviroment/Handles";
import { useUnit } from "effector-react";
import { $flow } from "@/flow/store/flow.slice";

export interface ShapeNodeData extends CSSProperties {
  type: ShapeType;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  textAlign?: TextAlign;
  alignContent?: AlignContent;
  fontSize?: number;
  lineHeight?: number;
  rotation?: number;
  text?: string;
  html?: string;
}

export function useNodeDimensions(id: string) {
  const node = useStore((state) => state.nodeInternals.get(id));
  return {
    width: node?.width || 0,
    height: node?.height || 0,
  };
}

const contentCssFormules: Record<
  keyof typeof ShapeComponents,
  { width: string; height: string }
> = {
  circle: {
    width: "calc(90% / sqrt(2))",
    height: "calc(90% / sqrt(2))",
  },
  rectangle: {
    width: "90%",
    height: "90%",
  },
};

// Вращение ноды реализовано не только через состояние реакт флоу но и через useState rotation для того
// чтобы можно было сохранять ноду в бд только после окончания вращения а видеть результат вращения
// непосредственно при вращении

function ShapeNode({ id, selected, data }: NodeProps<ShapeNodeData>) {
  const { width, height } = useNodeDimensions(id);
  const { isDrawingMode } = useUnit($flow);
  const shiftKeyPressed = useKeyPress("Shift");
  const { setNodes } = useReactFlow();
  const { takeSnapshot } = useUndoRedo();
  const { zoom } = useViewport();

  const [rotation, setRotation] = useState(data.rotation || 0);

  const rotateControlRef = useRef<HTMLDivElement>(null);
  const updateNodeInternals = useUpdateNodeInternals();

  const onEditText = useCallback((e: React.ChangeEvent) => {
    const value = e.target.innerHTML || "";
    updateNode({ html: value });
  }, []);

  const updateNode = (nodePart: Partial<ShapeNodeData>) =>
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
          : node,
      ),
    );

  useEffect(() => {
    updateNodeInternals(id);
  }, []);

  useEffect(() => {
    if (!rotateControlRef.current) return;

    const selection = select(rotateControlRef.current);

    const dragHandler = drag<HTMLDivElement, any>()
      .on("drag", (evt) => {
        const dx = evt.x - 100;
        const dy = evt.y - 100;
        const rad = Math.atan2(dx, dy);
        const deg = rad * (180 / Math.PI);

        setRotation(180 - deg);
        updateNodeInternals(id);
      })
      .on("end", (evt) => {
        const dx = evt.x - 100;
        const dy = evt.y - 100;
        const rad = Math.atan2(dx, dy);
        const deg = rad * (180 / Math.PI);

        updateNode({ rotation: 180 - deg });
      });

    selection.call(dragHandler);
  }, [id, updateNodeInternals, takeSnapshot]);

  const handleStyle = useMemo(
    () => ({
      backgroundColor: data.backgroundColor,
      maxHeight: "50px",
      maxWidth: "50px",
      height: 10 / zoom + "px",
      width: 10 / zoom + "px",
    }),
    [data, zoom],
  );

  const contentStyle = useMemo(
    () => ({
      ...data,
      width: contentCssFormules[data.type].width,
      maxHeight: contentCssFormules[data.type].height,
      fontSize: data.fontSize + "px",
      lineHeight: data.fontSize ? data.fontSize + 6 + "px" : undefined,
    }),
    [data],
  );

  return (
    <div
      className="h-full"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {!isDrawingMode && (
        <NodeToolbar isVisible={selected} position={Position.Top} offset={40}>
          <ToolbarControlls
            id={id}
            data={data}
            bold
            italic
            underline
            strike
            textAlign
            alignContent
            color
            backgroundColor
            fontSize
          />
        </NodeToolbar>
      )}

      <NodeResizer
        keepAspectRatio={shiftKeyPressed}
        isVisible={selected}
        handleStyle={{
          zIndex: "10 !important",
          maxHeight: "50px",
          maxWidth: "50px",
          height: 10 / zoom + "px",
          width: 10 / zoom + "px",
          borderColor: "#0066ff",
          backgroundColor: "#0066ff",
          borderRadius: 0,
        }}
        lineStyle={{
          borderWidth: 2 / zoom + "px",
          borderColor: "#0066ff",
        }}
        onResizeStart={() => takeSnapshot()}
      />

      <Shape
        type={data.type}
        width={width}
        height={height}
        fill={data.backgroundColor}
        strokeWidth={2}
        stroke={data.borderColor}
      />

      <Handles handleStyle={handleStyle} />

      <div
        ref={rotateControlRef}
        className={`${
          !selected && "hidden"
        } absolute block top-[-30px] left-1/2 -translate-x-1/2 nodrag w-5 h-5`}
      >
        <RotateCw size={16} />
      </div>

      <ContentEditable
        value={data.html ?? "Введите текст"}
        onChange={onEditText}
        style={contentStyle}
      />
    </div>
  );
}

export default ShapeNode;
