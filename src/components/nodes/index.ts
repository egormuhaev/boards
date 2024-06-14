import RectangleNode, { rectangleNodeFlowTypes } from "./RectangleNode";
import TextNode, { textNodeFlowTypes } from "./TextNode";
import VideoNode, { videoFlowTypes } from "./VideoNode";
import FileNode, { fileFlowTypes } from "./FileNode";
import PictureNode, { pictureFlowTypes } from "./PictureNode";
import PDFNode, { pdfFlowTypes } from "./PDFNode";
import CircleNode, { circleNodeFlowTypes } from "./CircleNode";
import SVGDrawerNode, {
  svgDrawingNodeTypes,
} from "./svgDrawingNode/SvgDrawingNode";
import CanvasDrawingNode, { canvasDrawingNodeTypes } from "./CanvasDrawingNode";

export {
  RectangleNode,
  TextNode,
  VideoNode,
  FileNode,
  PictureNode,
  PDFNode,
  CircleNode,
};

export enum NodeTypes {
  RectangleNodeFlowTypes = rectangleNodeFlowTypes,
  CircleNodeFlowTypes = circleNodeFlowTypes,
  TextNodeFlowTypes = textNodeFlowTypes,
  VideoNodeFlowTypes = videoFlowTypes,
  FileNodeFlowTypes = fileFlowTypes,
  PictureNodeFlowTypes = pictureFlowTypes,
  PDFNodeFlowTypes = pdfFlowTypes,
  SVGDrawingNodeTypes = svgDrawingNodeTypes,
  CanvasDrawingNodeTypes = canvasDrawingNodeTypes,
}

export const nodeTypes = {
  [NodeTypes.RectangleNodeFlowTypes]: RectangleNode,
  [NodeTypes.CircleNodeFlowTypes]: CircleNode,
  [NodeTypes.TextNodeFlowTypes]: TextNode,
  [NodeTypes.VideoNodeFlowTypes]: VideoNode,
  [NodeTypes.FileNodeFlowTypes]: FileNode,
  [NodeTypes.PictureNodeFlowTypes]: PictureNode,
  [NodeTypes.PDFNodeFlowTypes]: PDFNode,
  [NodeTypes.SVGDrawingNodeTypes]: SVGDrawerNode,
  [NodeTypes.CanvasDrawingNodeTypes]: CanvasDrawingNode,
};
