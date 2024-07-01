import useDrawingMode from "@/hooks/useDrawingMode";
import { Button } from "@/shadcn/ui/button";
import { ArrowLeft } from "lucide-react";
import { MouseEvent } from "react";

import { useNavigate } from "react-router-dom";

const FlowHeadPanel = ({}) => {
  const navigate = useNavigate();
  const { onDrawingMode } = useDrawingMode();

  const clickHandler = (e: MouseEvent<HTMLButtonElement>, func: Function) => {
    e.preventDefault();
    e.stopPropagation();

    func();
  };

  return (
    <nav className="w-[50px] fixed top-5 left-5 flex z-50 gap-5 p-2 bg-white rounded-lg border border-solid-1 border-slate-300">
      <Button
        onClick={(e) =>
          clickHandler(e, () => {
            navigate("/");
          })
        }
        className="w-full h-full aspect-square p-2 outline-none border-none text-black bg-white hover:text-white hover:bg-black"
        title="Вернуться к доскам"
      >
        <ArrowLeft className="h-full w-full" />
      </Button>
    </nav>
  );
};

export default FlowHeadPanel;
