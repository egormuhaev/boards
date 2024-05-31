import { $flow } from "@/flow/store/flow.slice";
import { $boardPlayground, changeNode } from "@/flow/store/playground.slice";
import { Button } from "@/shadcn/ui/button";
import { useUnit } from "effector-react";
import { AlignCenter, AlignLeft, AlignRight, Type } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { BlockPicker, ColorResult } from "react-color";

export type TextAlign = "center" | "left" | "right";

interface Props {
  id: string;
  bgColor: string;
  textColor: string;
  textAlign: TextAlign;
}

const ToolbarControlls: React.FC<Props> = ({
  id,
  bgColor,
  textColor,
  textAlign,
}) => {
  const playgroundState = useUnit($boardPlayground);
  const flowState = useUnit($flow);

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

  const positionText = useCallback(
    (textAlign: TextAlign) => {
      const newNodes = playgroundState.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              textAlign,
            },
          };
        }
        return node;
      });

      changeNode([...newNodes]);
    },
    [textAlign, playgroundState.nodes]
  );

  return (
    <div className="flex flex-row gap-2 justify-center items-center bg-white border border-solid-2 border-black rounded-lg h-10 box-border p-2">
      <ColorPickerButton color={bgColor} pickHandler={changeBgThisNodeColor} />

      <ColorPickerButton
        color={textColor}
        pickHandler={changeTextThisNodeColor}
        icon={<Type color="white" size={16} />}
      />

      <PositionTextButton
        clickHandler={positionText}
        position="left"
        active={textAlign === "left"}
      />

      <PositionTextButton
        clickHandler={positionText}
        position="center"
        active={textAlign === "center"}
      />

      <PositionTextButton
        clickHandler={positionText}
        position="right"
        active={textAlign === "right"}
      />
    </div>
  );
};

const PositionTextButton = memo(
  ({
    clickHandler,
    position,
    active,
  }: {
    clickHandler: (position: TextAlign) => void;
    position: TextAlign;
    active?: boolean;
  }) => {
    const theme = active
      ? "text-white bg-black"
      : "text-black bg-white hover:text-white hover:bg-black";

    return (
      <Button
        onClick={() => clickHandler(position)}
        className={`bg-white px-2 border border-solid-2 border-black rounded-lg h-full ${theme}`}
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
        className="h-full w-[40px] p-0 bg-yellow-400 hover:bg-yellow-300 rounded-lg relative"
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
