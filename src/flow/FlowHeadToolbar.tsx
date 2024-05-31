import { Button } from "@/shadcn/ui/button";
import { useUnit } from "effector-react";
import { $flow, changeDrawingMode } from "./store/flow.slice";
import { $boardPlayground } from "./store/playground.slice";
import { setCreateBuffer } from "./store/playground.slice";
import cn from "classnames";
import { Panel } from "reactflow";
import { MdOutlineDraw } from "react-icons/md";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { FaPhotoVideo, FaFile } from "react-icons/fa";
import { CgShapeCircle } from "react-icons/cg";
import { LuRectangleHorizontal, LuText } from "react-icons/lu";
import { NodeTypes } from "@/components";
import { Type } from "lucide-react";

const FlowHeadToolbar = () => {
  const flowState = useUnit($flow);
  const playgroundState = useUnit($boardPlayground);

  const saveNewNodeDataInBuffer = (type: string) => (_: React.MouseEvent) => {
    setCreateBuffer({
      type,
    });
  };

  return (
    <Panel position="top-left">
      <div className="flex flex-row justify-start items-center gap-5">
        <Button
          onClick={() => {
            changeDrawingMode(!flowState.isDrawingMode);
          }}
          className={cn("h-[50px] w-[50px] outline-none border-none", {
            "bg-yellow-400": !flowState.isDrawingMode,
            "bg-green-400": flowState.isDrawingMode,
          })}
        >
          <MdOutlineDraw className="h-[30px] w-[30px]" />
        </Button>
        <Button className="h-[50px] w-[50px] outline-none border-none bg-yellow-400">
          <CgShapeCircle className="h-[30px] w-[30px]" />
        </Button>
        <Button
          onClick={saveNewNodeDataInBuffer(NodeTypes.RectTextNodeFlowTypes)}
          className={cn("h-[50px] w-[50px] outline-none border-none", {
            "bg-yellow-400":
              playgroundState.create?.type !== NodeTypes.RectTextNodeFlowTypes,
            "bg-green-400":
              playgroundState.create?.type === NodeTypes.RectTextNodeFlowTypes,
          })}
        >
          <LuRectangleHorizontal className="h-[30px] w-[30px]" />
        </Button>
        <Button
          onClick={saveNewNodeDataInBuffer(NodeTypes.TextNodeFlowTypes)}
          className={cn("h-[50px] w-[50px] outline-none border-none", {
            "bg-yellow-400":
              playgroundState.create?.type !== NodeTypes.TextNodeFlowTypes,
            "bg-green-400":
              playgroundState.create?.type === NodeTypes.TextNodeFlowTypes,
          })}
        >
          <Type className="h-[30px] w-[30px]" />
        </Button>
        <Button className="h-[50px] w-[50px] outline-none border-none bg-yellow-400">
          <FaFile className="h-[30px] w-[30px]" />
        </Button>
        <Button className="h-[50px] w-[50px] outline-none border-none bg-yellow-400">
          <BsMusicNoteBeamed className="h-[30px] w-[30px]" />
        </Button>
        <Button className="h-[50px] w-[50px] outline-none border-none bg-yellow-400">
          <FaPhotoVideo className="h-[30px] w-[30px]" />
        </Button>
      </div>
    </Panel>
  );
};

export default FlowHeadToolbar;
