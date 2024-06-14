import TextNode from "./TextNode";
import VideoNode from "./VideoNode";
import FileNode from "./FileNode";
import PictureNode from "./PictureNode";
import PDFNode from "./PDFNode";

import ShapeNode from "./shapeNode/ShapeNode";

export { TextNode, VideoNode, FileNode, PictureNode, PDFNode };

export const nodeTypes = {
  shape: ShapeNode,
  file: FileNode,
  text: TextNode,
};
