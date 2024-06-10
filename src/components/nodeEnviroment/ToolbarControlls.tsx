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
  const playgroundState = useUnit($boardPlayground);
  const flowState = useUnit($flow);
  const { takeSnapshot } = useUndoRedo();

  const changeBgThisNodeColor = useCallback(
    (color: ColorResult) => {
      if (!flowState.isDrawingMode) {
        const newNodes = playgroundState.nodes.map((nds) => {
          if (nds.id === id) {
            return {
              ...nds,
              data: {
                ...nds.data,
                bgColor: color.hex,
              },
            };
          }
          return nds;
        });

        changeNode([...newNodes]);
      }
    },
    [bgColor, playgroundState.nodes]
  );

  const changeTextThisNodeColor = useCallback(
    (color: ColorResult) => {
      if (!flowState.isDrawingMode) {
        const newNodes = playgroundState.nodes.map((nds) => {
          if (nds.id === id) {
            return {
              ...nds,
              data: {
                ...nds.data,
                textColor: color.hex,
              },
            };
          }
          return nds;
        });

        changeNode([...newNodes]);
      }
    },
    [textColor, playgroundState.nodes]
  );

  const horizontalAlignText = useCallback(
    (horizontalAlign: HorizontalAlign) => {
      const newNodes = playgroundState.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              horizontalAlign,
            },
          };
        }
        return node;
      });

      changeNode([...newNodes]);
    },
    [horizontalAlign, playgroundState.nodes]
  );

  const verticalAlignText = useCallback(
    (verticalAlign: VerticalAlign) => {
      const newNodes = playgroundState.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              verticalAlign,
            },
          };
        }
        return node;
      });

      changeNode([...newNodes]);
    },
    [verticalAlign, playgroundState.nodes]
  );

  const changeFontSize = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const newNodes = playgroundState.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              fontSize: +e.target.value,
            },
          };
        }
        return node;
      });

      changeNode([...newNodes]);
    },
    [fontSize, playgroundState.nodes]
  );

  return (
    <div className="flex flex-row gap-2 justify-center p-2 items-center bg-white border border-solid-1 border-slate-300 rounded-lg h-10 box-border">
      {bgColor && (
        <>
          <ColorPickerButton
            color={bgColor}
            pickHandler={changeBgThisNodeColor}
          />
          <div className="h-full w-[1px] bg-slate-300" />
        </>
      )}

      {textColor && (
        <>
          <ColorPickerButton
            color={textColor}
            pickHandler={changeTextThisNodeColor}
            icon={<Type color="white" size={16} />}
          />
          <div className="h-full w-[1px] bg-slate-300" />
        </>
      )}

      {horizontalAlign && (
        <>
          <HorizontalAlignTextButton
            clickHandler={horizontalAlignText}
            position="left"
            active={horizontalAlign === "left"}
          />
          <HorizontalAlignTextButton
            clickHandler={horizontalAlignText}
            position="center"
            active={horizontalAlign === "center"}
          />
          <HorizontalAlignTextButton
            clickHandler={horizontalAlignText}
            position="right"
            active={horizontalAlign === "right"}
          />
          <div className="h-full w-[1px] bg-slate-300" />
        </>
      )}

      {verticalAlign && (
        <>
          <VerticalAlignTextButton
            clickHandler={verticalAlignText}
            position="start"
            active={verticalAlign === "start"}
          />
          <VerticalAlignTextButton
            clickHandler={verticalAlignText}
            position="center"
            active={verticalAlign === "center"}
          />
          <VerticalAlignTextButton
            clickHandler={verticalAlignText}
            position="end"
            active={verticalAlign === "end"}
          />
        </>
      )}

      {fontSize && (
        <FontSelect fontSize={fontSize} clickHandler={changeFontSize} />
      )}

      <Trash2
        fontSize={fontSize}
        color="red"
        onClick={() => {
          const node = playgroundState.nodes.find((nds) => nds.id !== id);
          if (!node) return;

          takeSnapshot();

          deleteNode(node);
          // changeNode(nodes);
        }}
      />
    </div>
  );
};

const FontSelect = memo(
  ({
    fontSize,
    clickHandler,
  }: {
    fontSize: number;
    clickHandler: (e: ChangeEvent<HTMLSelectElement>) => void;
  }) => {
    const values: number[] = [...Array(100)]
      .map((_, i) => i + 1)
      .filter((val) => val % 2 === 0);

    return (
      <select value={fontSize} onChange={clickHandler}>
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
        style={{
          backgroundColor: color,
        }}
        onMouseEnter={() => {
          setVisibleColorPicker(true);
        }}
        onMouseLeave={() => {
          setVisibleColorPicker(false);
        }}
        className="h-full aspect-square p-[1px] bg-yellow-400 hover:bg-yellow-300 rounded-lg relative"
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
