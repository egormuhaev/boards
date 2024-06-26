import { colorsPalet } from "@/flow/data";
import { AlignContent, TextAlign } from "@/flow/store/types/playground.schema";
import useUndoRedo from "@/hooks/useUndoRedo";
import { Button } from "@/shadcn/ui/button";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDownToLine,
  ArrowUpToLine,
  FoldVertical,
  Trash2,
  Type,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import { BlockPicker } from "react-color";
import { useNodes, useReactFlow } from "reactflow";
import { ShapeNodeData } from "../shapeNode/ShapeNode";

interface Props {
  id: string;
  data: ShapeNodeData;
}

const ToolbarControlls = ({
  id,
  data: { textAlign, alignContent, color, backgroundColor, fontSize },
}: Props) => {
  const { takeSnapshot } = useUndoRedo();
  const nodes = useNodes();
  const { setNodes, deleteElements } = useReactFlow();

  const updateNode = useCallback(
    (changes: Partial<ShapeNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...changes,
                },
              }
            : node,
        ),
      );
    },
    [nodes],
  );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-row gap-2 justify-center p-2 items-center bg-white border border-solid-1 border-slate-300 rounded-lg h-10 box-border"
    >
      {backgroundColor && (
        <>
          <ColorPickerButton
            color={backgroundColor}
            pickHandler={updateNode}
            updatingKey="backgroundColor"
          />
          <div className="h-full w-[1px] bg-slate-300" />
        </>
      )}

      {color && (
        <>
          <ColorPickerButton
            color={color}
            pickHandler={updateNode}
            icon={<Type color="white" size={16} />}
            updatingKey="color"
          />
          <div className="h-full w-[1px] bg-slate-300" />
        </>
      )}

      <FontRichButton
        rich="bold"
        clickHandler={() => document.execCommand("bold", false)}
      />
      <FontRichButton
        rich="italic"
        clickHandler={() => document.execCommand("italic", true, null)}
      />
      <FontRichButton
        rich="underline"
        clickHandler={() => document.execCommand("underline", false, null)}
      />

      {textAlign && (
        <>
          <HorizontalAlignTextButton
            clickHandler={updateNode}
            textAlign="left"
            active={textAlign === "left"}
          />
          <HorizontalAlignTextButton
            clickHandler={updateNode}
            textAlign="center"
            active={textAlign === "center"}
          />
          <HorizontalAlignTextButton
            clickHandler={updateNode}
            textAlign="right"
            active={textAlign === "right"}
          />
          <div className="h-full w-[1px] bg-slate-300" />
        </>
      )}

      {alignContent && (
        <>
          <VerticalAlignTextButton
            clickHandler={updateNode}
            alignContent="start"
            active={alignContent === "start"}
          />
          <VerticalAlignTextButton
            clickHandler={updateNode}
            alignContent="center"
            active={alignContent === "center"}
          />
          <VerticalAlignTextButton
            clickHandler={updateNode}
            alignContent="end"
            active={alignContent === "end"}
          />
          <div className="h-full w-[1px] bg-slate-300" />
        </>
      )}

      {fontSize && (
        <>
          <FontSelect fontSize={fontSize} clickHandler={updateNode} />
          <div className="h-full w-[1px] bg-slate-300" />
        </>
      )}

      <TrashButton
        clickHandler={() => {
          const node = nodes.find((nds) => nds.id == id);
          if (!node) return;

          takeSnapshot();

          deleteElements({ nodes: [node] });
        }}
      />
    </div>
  );
};

const FontRichButton = memo(
  ({
    rich,
    clickHandler,
  }: {
    rich: "bold" | "italic" | "underline";
    clickHandler: () => void;
  }) => {
    return (
      <Button
        onClick={clickHandler}
        className={`text-[18px] h-full aspect-square bg-white p-[1px] text-black border border-solid-2 border-black hover:bg-black hover:text-white rounded-sm`}
      >
        {rich === "bold" ? (
          <span>B</span>
        ) : rich === "italic" ? (
          <span>I</span>
        ) : rich === "underline" ? (
          <span>U</span>
        ) : null}
      </Button>
    );
  },
);

const FontSelect = memo(
  ({
    fontSize,
    clickHandler,
  }: {
    fontSize: number;
    clickHandler: (changes: Partial<ShapeNodeData>) => void;
  }) => {
    const values: number[] = [...Array(100)]
      .map((_, i) => i + 1)
      .filter((val) => val % 2 === 0);

    return (
      <select
        value={fontSize}
        onChange={(e) => clickHandler({ fontSize: +e.target.value })}
      >
        {values.map((val) => (
          <option
            key={val}
            value={val}
            className={val === fontSize ? `bg-slate-300` : undefined}
          >
            {val + "px"}
          </option>
        ))}
      </select>
    );
  },
);

const TrashButton = memo(({ clickHandler }: { clickHandler: () => void }) => {
  return (
    <Button
      onClick={clickHandler}
      className={`h-full aspect-square bg-white p-[1px] text-black hover:bg-black hover:text-white rounded-sm`}
    >
      <Trash2 size={18} />
    </Button>
  );
});

const VerticalAlignTextButton = memo(
  ({
    clickHandler,
    alignContent,
    active,
  }: {
    clickHandler: (changes: Partial<ShapeNodeData>) => void;
    alignContent: AlignContent;
    active?: boolean;
  }) => {
    const theme = active
      ? "text-white bg-black"
      : "text-black bg-white hover:text-white hover:bg-black";

    return (
      <Button
        onClick={() => clickHandler({ alignContent })}
        className={`h-full aspect-square bg-white p-[1px] border border-solid-2 border-black rounded-sm ${theme}`}
      >
        {alignContent === "start" ? (
          <ArrowUpToLine size={16} />
        ) : alignContent === "center" ? (
          <FoldVertical size={16} />
        ) : (
          <ArrowDownToLine size={16} />
        )}
      </Button>
    );
  },
);

const HorizontalAlignTextButton = memo(
  ({
    clickHandler,
    textAlign,
    active,
  }: {
    clickHandler: (changes: Partial<ShapeNodeData>) => void;
    textAlign: TextAlign;
    active?: boolean;
  }) => {
    const theme = active
      ? "text-white bg-black"
      : "text-black bg-white hover:text-white hover:bg-black";

    return (
      <Button
        onClick={() => clickHandler({ textAlign })}
        className={`h-full aspect-square bg-white p-[1px] border border-solid-2 border-black rounded-sm ${theme}`}
      >
        {textAlign === "center" ? (
          <AlignCenter size={16} />
        ) : textAlign === "right" ? (
          <AlignRight size={16} />
        ) : (
          <AlignLeft size={16} />
        )}
      </Button>
    );
  },
);

const ColorPickerButton = memo(
  ({
    color,
    pickHandler,
    icon,
    updatingKey,
  }: {
    color: string;
    pickHandler: (changes: Partial<ShapeNodeData>) => void;
    icon?: JSX.Element;
    updatingKey: "color" | "backgroundColor";
  }) => {
    const [visibleColorPicker, setVisibleColorPicker] = useState(false);

    return (
      <Button
        onMouseEnter={() => setVisibleColorPicker(true)}
        onMouseLeave={() => setVisibleColorPicker(false)}
        className="h-full aspect-square p-[1px] bg-yellow-400 hover:bg-yellow-300 rounded-lg relative"
        style={{
          backgroundColor: color,
        }}
      >
        {icon}

        {visibleColorPicker && (
          <div className="absolute h-auto w-auto top-0 translate-y-7 ">
            <BlockPicker
              color={color}
              colors={colorsPalet.map((color: string) => "#" + color)}
              onChangeComplete={(e) => {
                pickHandler({ [updatingKey]: e.hex });
                setVisibleColorPicker(false);
              }}
            />
          </div>
        )}
      </Button>
    );
  },
);

export default memo(ToolbarControlls);
