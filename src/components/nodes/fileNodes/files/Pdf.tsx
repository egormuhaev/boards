import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useRef, useState } from "react";
import { CustomFile } from "./types";

const Pdf = ({ file }: { file: CustomFile }) => {
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setActive(true));

  return (
    <div
      ref={ref}
      onClick={() => setActive(false)}
      className="flex justify-center items-center box-border bg-transparent gap-3 w-full h-full"
    >
      <iframe
        id="pdf-js-viewer"
        src={`${file.path}`}
        title="webviewer"
        width="100%"
        height="100%"
        style={{
          pointerEvents: active ? "none" : "auto", // Важно: пропуск событий мыши
        }}
      ></iframe>
    </div>
  );
};

export const pdfFlowTypes = "pdfFlow";

export default Pdf;
