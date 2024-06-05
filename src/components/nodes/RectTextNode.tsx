import { NodeProps } from "reactflow";
import DefaultNodeControlls from "../nodeEnviroment/DefaultNodeControlls";
import { $flow } from "../../flow/store/flow.slice";
import { useUnit } from "effector-react";
import { useEffect, useRef, useState } from "react";
import { Settings } from "../nodeEnviroment/ToolbarControlls";

interface Props extends Settings {
  id: string;
}

const RectTextNode = ({ selected, data, id }: NodeProps<Props>) => {
  const flowState = useUnit($flow);

  const [editText, setEditText] = useState(false);
  const [text, setText] = useState("");

  const textarea = useRef<HTMLDivElement>(null);

  const onEditText = (e: React.ChangeEvent<HTMLDivElement>) => {
    const value = e.target.innerHTML;
    setText(value);
  };

  useEffect(() => {
    if (editText) {
      textarea.current?.focus();
      // textarea.current?.setSelectionRange(
      //   textarea.current.value.length,
      //   textarea.current.value.length
      // );
    } else {
      // textarea.current?.setSelectionRange(0, 0);
      textarea.current?.blur();
    }
  }, [editText]);

  return (
    <DefaultNodeControlls
      id={id}
      isSelect={selected}
      bgColor={data.bgColor}
      textColor={data.textColor}
      isDrawMode={flowState.isDrawingMode}
      horizontalAlign={data.horizontalAlign}
      verticalAlign={data.verticalAlign}
      fontSize={data.fontSize}
    >
      <div
        onClick={() => setEditText(false)}
        className="h-full w-full flex flex-col justify-center items-center rounded-md min-w-[180px] min-h-[68px] box-border p-2"
        style={{
          backgroundColor: data.bgColor,
        }}
      >
        {editText ? (
          <div
            contentEditable={editText}
            ref={textarea}
            onChange={onEditText}
            onClick={(e) => e.stopPropagation()}
            onBlur={() => setEditText(false)}
            className="flex-1  w-full resize-none outline-none break-words text-ellipsis overflow-hidden box-border p-0 m-0 border-none nodrag cursor-text"
            style={{
              backgroundColor: data.bgColor,
              color: data.textColor,
              textAlign: data.horizontalAlign,
              alignContent: data.verticalAlign,
              fontSize: data.fontSize + "px",
              lineHeight: data.fontSize + "px",
            }}
          >
            {text}
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setEditText(true);
            }}
            className="flex-1  w-full resize-none outline-none break-words text-ellipsis overflow-hidden box-border p-0 m-0 border-none"
            style={{
              backgroundColor: data.bgColor,
              color: data.textColor,
              textAlign: data.horizontalAlign,
              alignContent: data.verticalAlign,
              fontSize: data.fontSize + "px",
              lineHeight: data.fontSize + "px",
            }}
          >
            {text}
          </div>
        )}
      </div>
    </DefaultNodeControlls>
  );
};

export const rectTextNodeFlowTypes = "rectTextNode";

export default RectTextNode;
