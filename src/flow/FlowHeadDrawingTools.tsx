import { Button } from "@/shadcn/ui/button";
import { Panel } from "reactflow";

export default function FlowHeadDrawingTools() {
  return (
    <Panel position="top-center">
      <div className="h-[50px] w-[auto] flex-row z-50 gap-5 p-2 bg-white rounded-lg border border-solid-1 border-slate-300">
        <Button
          className="w-full h-full aspect-square p-2 outline-none border-none
        text-black bg-white hover:text-white hover:bg-black"
        ></Button>
      </div>
    </Panel>
  );
}
