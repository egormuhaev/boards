import useOnClickOutside from "@/hooks/useOnClickOutside";
import useUndoRedo from "@/hooks/useUndoRedo";
import {
  CSSProperties,
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReactFlow } from "reactflow";

interface ContentProps {
  value: string | undefined;
  onChange: (e: React.ChangeEvent<Element>) => void;
  style: CSSProperties;
}

function getCaret(el: HTMLDivElement | null) {
  if (!el) return;

  let caretAt = 0;
  const sel = window.getSelection();
  if (!sel) return;

  if (sel.rangeCount == 0) {
    return caretAt;
  }

  const range = sel.getRangeAt(0);
  const preRange = range.cloneRange();
  preRange.selectNodeContents(el);
  preRange.setEnd(range.endContainer, range.endOffset);
  caretAt = preRange.toString().length;

  return caretAt;
}

function setCaret(el: HTMLDivElement | null, offset?: number) {
  if (!el || !offset) return;

  let sel = window.getSelection();
  if (!sel) return;

  let range = document.createRange();

  range.setStart(el.childNodes[0], offset);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

const Content = ({ value, onChange, style }: ContentProps) => {
  // const { takeSnapshot } = useUndoRedo();

  const [active, setActive] = useState(false);

  useEffect(() => {
    console.log("active: ", active);
  }, [active]);

  const contentRef = useRef<HTMLDivElement>(null);
  const caretPos = useRef<number>();

  useOnClickOutside(contentRef, (e) => {
    console.log("outside");
    setActive(false);
  });

  const inputHandler = (e: FormEvent) => {
    // takeSnapshot();
    caretPos.current = getCaret(contentRef.current);
    onChange(e as unknown as ChangeEvent);
  };

  useEffect(() => {
    setCaret(contentRef.current, caretPos.current);
    contentRef.current?.focus();
  }, [value]);

  const focus = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!active) {
      setActive(true);
    } else {
      contentRef.current?.focus();
    }
  };

  const { width, maxHeight, fontSize, alignContent, ...otherStyles } = style;

  return (
    <div
      onClick={focus}
      className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex bg-transparent overflow-y-scroll"
      style={{
        maxHeight,
        width,
        height: maxHeight,
        alignItems: alignContent,
        justifyContent: "center",
      }}
    >
      <div
        ref={contentRef}
        onInput={inputHandler}
        onBlur={() => setActive(false)}
        contentEditable={active}
        className={`w-full resize-none bg-transparent outline-none break-words text-ellipsis overflow-hidden box-border border-none ${
          active ? "nodrag cursor-text" : ""
        }`}
        style={{ ...otherStyles, minHeight: fontSize }}
        suppressContentEditableWarning
      >
        {value}
      </div>
    </div>
  );
};

export default Content;
