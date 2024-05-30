import { $flow } from "@/flow/store/flow.slice";
import { $boardPlayground, changeNode } from "@/flow/store/playground.slice";
import { Button } from "@/shadcn/ui/button";
import { useStore } from "effector-react";
import { useState } from "react";
import { BlockPicker } from "react-color";

interface Props {
  id: string;
  bgColor: string;
}

const ToolbarControlls: React.FC<Props> = ({ id, bgColor }) => {
  const playgroundState = useStore($boardPlayground);
  const flowState = useStore($flow);
  const [visibleColorPicker, setVisibleColorPicker] = useState(false);

  const changeBgThisNodeColor = (color: any) => {
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
  };

  return (
    <div className="flex flex-row gap-2 justify-center items-center">
      <Button
        style={{
          backgroundColor: bgColor,
        }}
        onClick={() => {
          setVisibleColorPicker(!visibleColorPicker);
        }}
        className="h-[40px] w-[40px] border-[#000] border-2  bg-yellow-400 hover:bg-yellow-300 rounded-full"
      >
        {visibleColorPicker && (
          <div
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
            }}
            className="absolute h-auto w-auto top-[50px] left-[-65px]"
          >
            <BlockPicker
              color={bgColor}
              colors={playgroundState.colorsPalet.map(
                (color: string) => "#" + color,
              )}
              onChangeComplete={changeBgThisNodeColor}
            />
          </div>
        )}
      </Button>
    </div>
  );
};

export default ToolbarControlls;
