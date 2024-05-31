import { NodeProps } from "reactflow";
import DefaultNodeControlls from "../nodeEnviroment/DefaultNodeControlls";
import { $flow } from "../../flow/store/flow.slice";
import { useUnit } from "effector-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TextAlign } from "../nodeEnviroment/ToolbarControlls";

interface Props {
  id: string;
  bgColor?: string;
  textColor?: string;
  textAlign: TextAlign;
}

const styles = {
  wrapper:
    "h-full w-full flex flex-col justify-center items-center rounded-md min-w-[180px] min-h-[68px] box-border p-2",
  textarea:
    "flex-1 w-full resize-none text-left outline-none text-white overflow-y-auto align-middle break-words",
};

const RectTextNode: React.FC<NodeProps<Props>> = ({ selected, data, id }) => {
  const flowState = useUnit($flow);

  const [editText, setEditText] = useState(false);
  const [text, setText] = useState("");

  const textarea = useRef<HTMLTextAreaElement>(null);

  const onEditText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
  };

  useEffect(() => {
    if (editText) {
      textarea.current?.focus();
      textarea.current?.setSelectionRange(
        textarea.current.value.length,
        textarea.current.value.length
      );
    } else {
      textarea.current?.setSelectionRange(0, 0);
      textarea.current?.blur();
    }
  }, [editText]);

  return (
    <DefaultNodeControlls
      id={id}
      isSelect={selected}
      bgColor={data.bgColor ?? "#fff"}
      textColor={data.textColor ?? "#000"}
      isDrawMode={flowState.isDrawingMode}
      textAlign={data.textAlign ?? "left"}
    >
      <div
        onClick={() => setEditText(false)}
        className={styles.wrapper}
        style={{
          backgroundColor: data.bgColor,
        }}
      >
        {editText ? (
          <textarea
            value={text}
            ref={textarea}
            onChange={onEditText}
            onClick={(e) => e.stopPropagation()}
            onBlur={() => setEditText(false)}
            className={cn(styles.textarea, "nodrag")}
            style={{
              backgroundColor: data.bgColor,
              color: data.textColor,
              textAlign: data.textAlign,
            }}
          />
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setEditText(true);
            }}
            className={cn(
              styles.textarea,
              "inline text-ellipsis overflow-hidden"
            )}
            style={{
              backgroundColor: data.bgColor,
              color: data.textColor,
              textAlign: data.textAlign,
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
