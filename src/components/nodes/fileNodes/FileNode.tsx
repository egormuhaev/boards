import {
  Handle,
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  useKeyPress,
  useViewport,
} from "reactflow";
import Video from "./files/Video";
import File, { FileType } from "./File";
import Image from "./files/Image";
import Pdf from "./files/Pdf";
import { CustomFile } from "./files/types";
import Handles from "../nodeEnviroment/Handles";
import { useMemo } from "react";
import useUndoRedo from "@/hooks/useUndoRedo";
import ToolbarControlls from "../nodeEnviroment/ToolbarControlls";
import { useUnit } from "effector-react";
import { $flow } from "@/flow/store/flow.slice";

export interface FileNodeData extends CustomFile {
  type: FileType;
}

export const FileComponents = {
  video: Video,
  image: Image,
  pdf: Pdf,
};

const FileNode = ({ id, data, selected }: NodeProps<FileNodeData>) => {
  const shiftKeyPressed = useKeyPress("Shift");
  const { zoom } = useViewport();
  const { takeSnapshot } = useUndoRedo();
  const { isDrawingMode } = useUnit($flow);

  const handleStyle = useMemo(
    () => ({
      backgroundColor: "white",
      maxHeight: "50px",
      maxWidth: "50px",
      height: 10 / zoom + "px",
      width: 10 / zoom + "px",
    }),
    [data, zoom],
  );

  return (
    <>
      {!isDrawingMode && (
        <NodeToolbar isVisible={selected} position={Position.Top} offset={40}>
          <ToolbarControlls id={id} data={data} download downloadComressed />
        </NodeToolbar>
      )}

      <NodeResizer
        keepAspectRatio
        isVisible={selected}
        handleStyle={{
          maxHeight: "50px",
          maxWidth: "50px",
          height: 10 / zoom + "px",
          width: 10 / zoom + "px",
          borderColor: "#0066ff",
          backgroundColor: "#0066ff",
          borderRadius: 0,
        }}
        lineStyle={{
          borderWidth: 2 / zoom + "px",
          borderColor: "#0066ff",
        }}
        onResizeStart={() => takeSnapshot()}
      />

      <Handles handleStyle={handleStyle} />

      <File {...data} />
    </>
  );
};

export const fileFlowTypes = "fileFlow";

export default FileNode;
