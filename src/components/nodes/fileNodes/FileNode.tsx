import { Handle, NodeProps, NodeResizer, Position, useStore } from "reactflow";
import Video from "./files/Video";
import File, { FileType } from "./File";
import Image from "../shapeNode/shapes/Image";
import Pdf from "./files/Pdf";
import { useState } from "react";

export interface FileNodeData {
  type: FileType;
  file: File;
}

export const FileComponents = {
  video: Video,
  image: Image,
  pdf: Pdf,
};

const FileNode = ({ data, selected }: NodeProps<FileNodeData>) => {
  return (
    <>
      <NodeResizer
        isVisible={selected}
        handleStyle={{
          height: "5px",
          width: "5px",
          borderColor: "grey",
          backgroundColor: "grey",
          borderRadius: 0,
        }}
        lineStyle={{
          borderWidth: "2px",
          borderColor: "grey",
        }}
      />

      <Handle id="top" type="source" position={Position.Top} />
      <Handle id="right" type="source" position={Position.Right} />
      <Handle id="bottom" type="source" position={Position.Bottom} />
      <Handle id="left" type="source" position={Position.Left} />

      <File type={data.type} file={data.file} />
    </>
  );
};

export const fileFlowTypes = "fileFlow";

export default FileNode;
