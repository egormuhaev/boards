import { Button } from "@/shadcn/ui/button";
import { Panel } from "reactflow";
import { BlockPicker, ColorResult } from "react-color";
import { colorsPalet } from "@/flow/data";
import { memo, useState } from "react";
import { useUnit } from "effector-react";
import { $draw, changeColor } from "./store/draw.slice";
import { useCleaningEmptyCanvasesAfterDrawing } from "@/hooks/useCleaningEmptyCanvasesAfterDrawing";

export default function FlowHeadDrawingTools() {
  const cleaningEmptyCanvasesAfterDrawing =
    useCleaningEmptyCanvasesAfterDrawing();
  const colorPickHangler = (color: ColorResult) => {
    changeColor(color.hex);
    cleaningEmptyCanvasesAfterDrawing();
  };
  const drawState = useUnit($draw);
  return (
    <Panel
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      position="top-center"
    >
      <div className="h-[50px] w-[auto] flex-row z-50 gap-5 p-2 bg-white rounded-lg border border-solid-1 border-slate-300">
        <ColorPickerButton
          color={drawState.color}
          pickHandler={colorPickHangler}
        />
      </div>
    </Panel>
  );
}

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
              onChangeComplete={(e: any) => {
                pickHandler(e);
                setVisibleColorPicker(false);
              }}
            />
          </div>
        )}
      </Button>
    );
  },
);
