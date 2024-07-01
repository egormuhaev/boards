import TextNode from "./TextNode";
import ShapeNode from "./shapeNode/ShapeNode";
import SvgDrawingNode from "./svgDrawingNode/desktop/SvgDrawingNode";
import FileNode from "./fileNodes/FileNode";
import SvgMobileDrawingNode from "./svgDrawingNode/mobile/SvgMobileDrawingNode";

export const nodeTypes = {
  shape: ShapeNode,
  file: FileNode,
  text: TextNode,
  drawing: SvgDrawingNode,
  drawingMobile: SvgMobileDrawingNode,
};
