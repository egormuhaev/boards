import useUndoRedo from "@/hooks/useUndoRedo";
import {
  CSSProperties,
  ChangeEvent,
  FormEvent,
  MouseEvent,
  forwardRef,
} from "react";

interface ContentProps {
  active: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<Element>) => void;
  changeActive: (bool: boolean) => void;
  style: CSSProperties;
}

const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ active, value, onChange, changeActive, style }, ref) => {
    const { takeSnapshot } = useUndoRedo();

    const clickHandler = (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!active) changeActive(true);
    };

    const changeHandler = (e: FormEvent) => {
      takeSnapshot();
      onChange(e as unknown as ChangeEvent);
    };

    return (
      <div
        contentEditable={active}
        ref={ref}
        onChange={changeHandler}
        onClick={clickHandler}
        onBlur={() => changeActive(false)}
        className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex-1 w-full h-full resize-none bg-transparent outline-none break-words text-ellipsis overflow-hidden box-border p-0 m-0 border-none ${
          active ? "nodrag cursor-text" : ""
        }`}
        style={style}
      >
        {value || <br />}
      </div>
    );
  }
);

export default Content;
