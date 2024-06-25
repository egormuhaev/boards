import { FileComponents, FileNodeData } from "./FileNode";
import Unknown from "./files/Unknown";

export type FileType = keyof typeof FileComponents;

function File(props: FileNodeData) {
  const FileComponent = FileComponents[props.type];

  if (!FileComponent) {
    return <Unknown {...props} />;
  }

  return <FileComponent {...props} />;
}

export default File;
