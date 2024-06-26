import { Button } from "@/shadcn/ui/button";
import { Panel } from "reactflow";
import { BlockPicker, ColorResult } from "react-color";
import { colorsPalet } from "@/flow/data";
import { memo, useState } from "react";
import { useUnit } from "effector-react";
import {
  $draw,
  changeColor,
  changeWidth,
  changeTool,
} from "./store/draw.slice";
import { useCleaningEmptyCanvasesAfterDrawing } from "@/hooks/useCleaningEmptyCanvasesAfterDrawing";
import { Pen, Highlighter } from "lucide-react";
import { Slider } from "@/shadcn/ui/slider";
import { DrawTools } from "@/components/nodes/svgDrawingNode/constants";

export default function FlowHeadDrawingTools() {
  const drawState = useUnit($draw);
  const cleaningEmptyCanvasesAfterDrawing =
    useCleaningEmptyCanvasesAfterDrawing();

  const changeDrawingTool = (tool: DrawTools) => {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      changeTool(tool);
      cleaningEmptyCanvasesAfterDrawing();
    };
  };

  const colorPickHangler = (color: ColorResult) => {
    changeColor(color.hex);
    cleaningEmptyCanvasesAfterDrawing();
  };

  const changeLineWidth = (slide: number[]) => {
    const width = slide[slide.length - 1];
    changeWidth(width);
    cleaningEmptyCanvasesAfterDrawing();
  };

  return (
    <Panel
      position="top-center"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="h-[50px] w-auto flex  flex-row z-50 gap-3 p-2 bg-white rounded-lg border border-solid-1 border-slate-300">
        <SwithDrawTool
          activeTool={drawState.tool}
          changeTool={changeDrawingTool}
        />
        <ColorPickerButton
          color={drawState.color}
          pickHandler={colorPickHangler}
        />
        <div className="flex flex-row gap-2 items-center justify-center h-full w-[200px] aspect-square  outline-none border-none text-black bg-white ">
          <Slider
            onValueChange={changeLineWidth}
            value={[drawState.width]}
            defaultValue={[20]}
            max={100}
            step={1}
          />
          <div>{drawState.width}</div>
        </div>
      </div>
    </Panel>
  );
}

const SwithDrawTool = memo(
  ({
    changeTool,
    activeTool,
  }: {
    activeTool: DrawTools;
    changeTool: (
      tool: DrawTools,
    ) => (e: React.MouseEvent<HTMLButtonElement>) => void;
  }) => {
    return (
      <>
        <Button
          onClick={changeTool(DrawTools.Pen)}
          style={{
            backgroundColor:
              activeTool === DrawTools.Pen ? "yellow" : undefined,
          }}
          className="h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        >
          <Pen className="h-full w-full" />
        </Button>
        <Button
          onClick={changeTool(DrawTools.Highlighter)}
          style={{
            backgroundColor:
              activeTool === DrawTools.Highlighter ? "yellow" : undefined,
          }}
          className="h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        >
          <Highlighter className="h-full w-full" />
        </Button>
      </>
    );
  },
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
    const [visibleColorPicker, setVisibleColorPicker] = useState(false);

    return (
      <Button
        onMouseEnter={() => setVisibleColorPicker(true)}
        onMouseLeave={() => setVisibleColorPicker(false)}
        className="h-full aspect-square p-[1px] bg-yellow-400 hover:bg-yellow-300 rounded-full relative"
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
