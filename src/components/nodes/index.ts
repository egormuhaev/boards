import TextNode from "./TextNode";
import VideoNode from "./VideoNode";
import FileNode from "./FileNode";
import PictureNode from "./PictureNode";
import PDFNode from "./PDFNode";
import ShapeNode from "./shapeNode/ShapeNode";
import SvgDrawingNode from "./svgDrawingNode/desktop/SvgDrawingNode";

export { TextNode, VideoNode, FileNode, PictureNode, PDFNode, SvgDrawingNode };

export const nodeTypes = {
  shape: ShapeNode,
  file: FileNode,
  text: TextNode,
  drawing: SvgDrawingNode,
};
