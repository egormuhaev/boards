import useOnClickOutside from "@/hooks/useOnClickOutside";
import DOMPurify from "dompurify";
import {
  CSSProperties,
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const ContentEditable = ({
  value,
  onChange,
  style,
}: {
  value: string;
  onChange: (event: ChangeEvent) => void;
  style: Partial<CSSProperties>;
}) => {
  const defaultValue = useRef(value);
  const [active, setActive] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInput = (event: FormEvent) => onChange(event as ChangeEvent);

  useOnClickOutside(contentRef, () => setActive(false));

  const wrapperClickHandler = (event: MouseEvent) => {
    event.stopPropagation();
    setActive(!active);
  };

  const editableClickHandler = (event: MouseEvent) =>
    active ? event.stopPropagation() : setActive(true);

  const selectText = () => {
    if (!contentRef.current) return;

    const range = document.createRange();
    range.selectNodeContents(contentRef.current);

    const selection = window.getSelection();
    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(range);
  };

  useEffect(() => {
    if (active) {
      selectText();
      contentRef.current?.focus();
    }
  }, [active]);

  const { width, maxHeight, fontSize, alignContent, ...otherStyles } = style;

  return (
    <div
      onClick={wrapperClickHandler}
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
        onClick={editableClickHandler}
        ref={contentRef}
        contentEditable={active}
        onInput={handleInput}
        className={`w-full resize-none bg-transparent outline-none break-words text-ellipsis overflow-hidden box-border border-none ${
          active ? "nodrag cursor-text" : ""
        }`}
        spellCheck={false}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(defaultValue.current),
        }}
        style={{ ...otherStyles, minHeight: fontSize, fontSize }}
      />
    </div>
  );
};

export default ContentEditable;
