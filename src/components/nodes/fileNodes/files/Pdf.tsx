import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useRef, useState } from "react";
import { FileNodeData } from "../FileNode";

const fileViewerUrl = `${
  import.meta.env.VITE_FILE_SERVER_URL
}/pdf-reader/web/viewer.html?file=/`;

const Pdf = ({ filePath }: FileNodeData) => {
  const [active, setActive] = useState(true);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setActive(true));

  return (
    <div
      ref={ref}
      onDoubleClick={() => setActive(false)}
      className="flex justify-center items-center box-border bg-transparent gap-3 w-full h-full"
    >
      <iframe
        id="pdf-js-viewer"
        src={fileViewerUrl + filePath.slice(filePath.lastIndexOf("/") + 1)}
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
