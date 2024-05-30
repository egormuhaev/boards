import { Panel } from "reactflow";
import { SketchPicker } from "react-color";
import { useState } from "react";
import { $boardPlayground, setCreateBuffer } from "./store/playground.slice";
import { ICreateNewNodeBuffer } from "./store/types/playground.schema";
import { useStore } from "effector-react";

interface EditColorParamsProps {
  buffer: ICreateNewNodeBuffer | null;
  setBuffer: (newColor: ICreateNewNodeBuffer) => void;
}

const FlowHeadParamsNode = () => {
  const playgrounState = useStore($boardPlayground);
  return (
    <Panel position="top-right">
      <div className="text-white w-[200px] h-auto flex flex-col gap-5 justify-start items-center bg-yellow-400 rounded-md border-box p-2">
        <EditColorParams
          buffer={playgrounState.create}
          setBuffer={setCreateBuffer}
        />
        <EditTextAlignParams />
        <EditTextSizeParams />
      </div>
    </Panel>
  );
};

export const EditColorParams: React.FC<EditColorParamsProps> = ({
  buffer,
  setBuffer,
}) => {
  const [visibleColorPicker, setVisibleColorPicker] = useState(false);

  const onChangeColor = (color: any) => {
    if (buffer?.bgColor) {
      setBuffer({ ...buffer, bgColor: color.hex });
    }
  };

  return (
    <div
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
      }}
      className="relative w-full h-[20px] flex flex-row justify-start items-center gap-5"
    >
      {visibleColorPicker && (
        <div className="absolute h-auto w-auto top-0 right-[200px]">
          <SketchPicker
            color={buffer?.bgColor ?? "#fff"}
            onChangeComplete={onChangeColor}
          />
        </div>
      )}
      BG:
      <div
        onClick={() => {
          setVisibleColorPicker(!visibleColorPicker);
        }}
        className="rounded-sm h-[97%] w-[100%]"
        style={{
          backgroundColor: buffer?.bgColor,
        }}
      ></div>
    </div>
  );
};

export const EditTextAlignParams = () => {
  return <div className="w-full h-[20px]">Text Aling</div>;
};

export const EditTextSizeParams = () => {
  return <div className="w-full h-[20px]">Text Size</div>;
};

export default FlowHeadParamsNode;
