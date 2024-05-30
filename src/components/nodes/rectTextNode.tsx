import { NodeProps } from "reactflow";
import DefaultNodeControlls from "../nodeEnviroment/defaultNodeControls";
import { $flow } from "../../flow/store/flow.slice";
import { useStore } from "effector-react";
import { useState } from "react";

interface Props {
  id: string;
  bgColor?: string;
}

const styles = {
  wrapper:
    "h-full w-full  flex flex-col justify-center items-center p-5 rounded-md min-w-[180px] min-h-[68px]",
  textarea:
    "h-full w-full resize-none  text-left outline-none text-[#fff] border-box text-balance",
};

const RectTextNode: React.FC<NodeProps<Props>> = ({ selected, data, id }) => {
  const [editText, setEditText] = useState(false);
  const [text, setText] = useState("");
  const flowState = useStore($flow);

  const onEditText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
  };

  return (
    <DefaultNodeControlls
      id={id}
      isSelect={selected}
      bgColor={data.bgColor ?? "#fff"}
      isDrawMode={flowState.isDrawingMode}
    >
      <div
        onDoubleClick={() => {
          setEditText(!editText);
        }}
        className={styles.wrapper}
        style={{
          backgroundColor: data.bgColor,
        }}
      >
        {!editText && (
          <div
            style={{
              backgroundColor: data.bgColor,
            }}
            className={styles.textarea}
          >
            {text}
          </div>
        )}
        {editText && (
          <textarea
            onChange={onEditText}
            value={text}
            onWheel={(e: React.WheelEvent) => {
              e.preventDefault();
            }}
            className={styles.textarea}
            style={{
              backgroundColor: data.bgColor,
            }}
          />
        )}
      </div>
    </DefaultNodeControlls>
  );
};

export const rectTextNodeFlowTypes = "rectTextNode";

export default RectTextNode;
