import TextNode from "./TextNode";
import ShapeNode from "./shapeNode/ShapeNode";
import DrawingDesktopNode from "./drawingNode/desktop/DrawingDesktopNode";
import FileNode from "./fileNodes/FileNode";
import DrawingMobileNode from "./drawingNode/mobile/DrawingMobileNode";

export const nodeTypes = {
  shape: ShapeNode,
  file: FileNode,
  text: TextNode,
  drawing: DrawingDesktopNode,
  drawingMobile: DrawingMobileNode,
};
