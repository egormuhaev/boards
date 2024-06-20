import { FileComponents } from "./FileNode";
import Unknown from "./files/Unknown";
import { FileProps } from "./files/types";

export type FileType = keyof typeof FileComponents;

export type FileComponentProps = Partial<FileProps> & {
  type: FileType;
  file: File;
};

function File({ file, type }: FileComponentProps) {
  const FileComponent = FileComponents[type];

  if (!FileComponent) {
    return <Unknown file={file} />;
  }

  return <FileComponent file={file} />;
}

export default File;
