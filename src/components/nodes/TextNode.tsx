import { NodeProps, NodeResizer, NodeToolbar, Position } from "reactflow";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import ToolbarControlls from "./nodeEnviroment/ToolbarControlls";

interface Props {
  type: "text";
  id: string;
  bgColor?: string;
  textColor?: string;
}

const styles = {
  wrapper:
    "h-full w-full flex flex-col justify-center items-center rounded-md min-w-[180px] min-h-[30px] box-border p-2",
  textarea:
    "flex-1 w-full resize-none text-left outline-none text-black overflow-y-auto align-middle break-words",
};

const TextNode = ({ selected, data, id }: NodeProps<Props>) => {
  const [editText, setEditText] = useState(false);
  const [text, setText] = useState("Тут должен быть текст");

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
    <>
      <NodeResizer isVisible={selected} minWidth={180} minHeight={68} />

      <div
        onClick={() => setEditText(false)}
        className={cn(
          styles.wrapper,
          "bg-transparent",
          editText ? "border border-solid-2 border-black" : ""
        )}
      >
        {editText ? (
          <textarea
            value={text}
            ref={textarea}
            onChange={onEditText}
            onClick={(e) => e.stopPropagation()}
            onBlur={() => setEditText(false)}
            className={cn(styles.textarea, "nodrag bg-transparent")}
          />
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setEditText(true);
            }}
            className={cn(
              styles.textarea,
              "inline text-ellipsis overflow-hidden bg-transparent"
            )}
          >
            {text}
          </div>
        )}
      </div>
    </>
  );
};

export const textNodeFlowTypes = "textNode";

export default TextNode;
