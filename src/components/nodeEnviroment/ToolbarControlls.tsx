import { $flow } from "@/flow/store/flow.slice";
import {
  $boardPlayground,
  changeNode,
  deleteNode,
} from "@/flow/store/playground.slice";
import {
  HorizontalAlign,
  VerticalAlign,
} from "@/flow/store/types/playground.schema";
import useUndoRedo from "@/hooks/useUndoRedo";
import { Button } from "@/shadcn/ui/button";
import { useUnit } from "effector-react";
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
import { ChangeEvent, memo, useCallback, useState } from "react";
import { BlockPicker, ColorResult } from "react-color";
import { useNodes, useReactFlow } from "reactflow";

export type Settings = {
  horizontalAlign?: HorizontalAlign;
  verticalAlign?: VerticalAlign;
  textColor?: string;
  bgColor?: string;
  fontSize?: number;
  rotation?: string;
};

interface Props {
  id: string;
  settings: Settings;
}

const ToolbarControlls = ({
  id,
  settings: { horizontalAlign, verticalAlign, textColor, bgColor, fontSize },
}: Props) => {
  const { takeSnapshot } = useUndoRedo();
  const nodes = useNodes<Settings>();
  const { setNodes } = useReactFlow();

  const onChangeHorizontalAlign = useCallback(
    (horizontalAlign: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  horizontalAlign,
                },
              }
            : node
        )
      );
    },
    [nodes, horizontalAlign]
  );

  const onChangeVerticalAlign = useCallback(
    (verticalAlign: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  verticalAlign,
                },
              }
            : node
        )
      );
    },
    [nodes, verticalAlign]
  );

  const onChangeFontSize = useCallback(
    (fontSize: number) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  fontSize,
                },
              }
            : node
        )
      );
    },
    [fontSize, nodes]
  );

  const onChangeBgColor = useCallback(
    (color: ColorResult) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  bgColor: color.hex,
                },
              }
            : node
        )
      );
    },
    [bgColor, nodes]
  );

  const onChangeFontColor = useCallback(
    (color: ColorResult) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  textColor: color.hex,
                },
              }
            : node
        )
      );
    },
    [textColor, nodes]
  );

  return (
    <div className="flex flex-row gap-2 justify-center p-2 items-center bg-white border border-solid-1 border-slate-300 rounded-lg h-10 box-border">
      {bgColor && (
        <>
          <ColorPickerButton color={bgColor} pickHandler={onChangeBgColor} />
          <div className="h-full w-[1px] bg-slate-300" />
        </>
      )}

      {textColor && (
        <>
          <ColorPickerButton
            color={textColor}
            pickHandler={onChangeFontColor}
            icon={<Type color="white" size={16} />}
          />
          <div className="h-full w-[1px] bg-slate-300" />
        </>
      )}

      {horizontalAlign && (
        <>
          <HorizontalAlignTextButton
            clickHandler={onChangeHorizontalAlign}
            position="left"
            active={horizontalAlign === "left"}
          />
          <HorizontalAlignTextButton
            clickHandler={onChangeHorizontalAlign}
            position="center"
            active={horizontalAlign === "center"}
          />
          <HorizontalAlignTextButton
            clickHandler={onChangeHorizontalAlign}
            position="right"
            active={horizontalAlign === "right"}
          />
          <div className="h-full w-[1px] bg-slate-300" />
        </>
      )}

      {verticalAlign && (
        <>
          <VerticalAlignTextButton
            clickHandler={onChangeVerticalAlign}
            position="start"
            active={verticalAlign === "start"}
          />
          <VerticalAlignTextButton
            clickHandler={onChangeVerticalAlign}
            position="center"
            active={verticalAlign === "center"}
          />
          <VerticalAlignTextButton
            clickHandler={onChangeVerticalAlign}
            position="end"
            active={verticalAlign === "end"}
          />
        </>
      )}

      {fontSize && (
        <FontSelect fontSize={fontSize} clickHandler={onChangeFontSize} />
      )}

      {
        <TrashButton
          clickHandler={() => {
            const node = nodes.find((nds) => nds.id == id);
            if (!node) return;

            takeSnapshot();

            setNodes((nds) => nds.filter((node) => node.id !== id));
            // deleteNode(node);
          }}
        />
      }
    </div>
  );
};

const FontSelect = memo(
  ({
    fontSize,
    clickHandler,
  }: {
    fontSize: number;
    clickHandler: (fontSize: number) => void;
  }) => {
    const values: number[] = [...Array(100)]
      .map((_, i) => i + 1)
      .filter((val) => val % 2 === 0);

    return (
      <select value={fontSize} onChange={(e) => clickHandler(+e.target.value)}>
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
  }
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
    position,
    active,
  }: {
    clickHandler: (position: VerticalAlign) => void;
    position: VerticalAlign;
    active?: boolean;
  }) => {
    const theme = active
      ? "text-white bg-black"
      : "text-black bg-white hover:text-white hover:bg-black";

    return (
      <Button
        onClick={() => clickHandler(position)}
        className={`h-full aspect-square bg-white p-[1px] border border-solid-2 border-black rounded-sm ${theme}`}
      >
        {position === "start" ? (
          <ArrowUpToLine size={16} />
        ) : position === "center" ? (
          <FoldVertical size={16} />
        ) : (
          <ArrowDownToLine size={16} />
        )}
      </Button>
    );
  }
);

const HorizontalAlignTextButton = memo(
  ({
    clickHandler,
    position,
    active,
  }: {
    clickHandler: (position: HorizontalAlign) => void;
    position: HorizontalAlign;
    active?: boolean;
  }) => {
    const theme = active
      ? "text-white bg-black"
      : "text-black bg-white hover:text-white hover:bg-black";

    return (
      <Button
        onClick={() => clickHandler(position)}
        className={`h-full aspect-square bg-white p-[1px] border border-solid-2 border-black rounded-sm ${theme}`}
      >
        {position === "center" ? (
          <AlignCenter size={16} />
        ) : position === "right" ? (
          <AlignRight size={16} />
        ) : (
          <AlignLeft size={16} />
        )}
      </Button>
    );
  }
);

const ColorPickerButton = memo(
  ({
    color,
    pickHandler,
    icon,
  }: {
    color: string;
    pickHandler: (color: ColorResult) => void;
    icon?: JSX.Element;
  }) => {
    const playgroundState = useUnit($boardPlayground);
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
              colors={playgroundState.colorsPalet.map(
                (color: string) => "#" + color
              )}
              onChangeComplete={(e) => {
                pickHandler(e);
                setVisibleColorPicker(false);
              }}
            />
          </div>
        )}
      </Button>
    );
  }
);

export default memo(ToolbarControlls);
