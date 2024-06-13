import RectangleNode, { rectangleNodeFlowTypes } from "./RectangleNode";
import CanvasNode, { canvasNodeFlowTypes } from "./CanvasNode";
import TextNode, { textNodeFlowTypes } from "./TextNode";
import VideoNode, { videoFlowTypes } from "./VideoNode";
import FileNode, { fileFlowTypes } from "./FileNode";
import PictureNode, { pictureFlowTypes } from "./PictureNode";
import PDFNode, { pdfFlowTypes } from "./PDFNode";
import CircleNode, { circleNodeFlowTypes } from "./CircleNode";
import SVGDrawerNode, { svgDrawerNodeTypes } from "./SVGDrawerNode";

export {
  RectangleNode,
  CanvasNode,
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
  CanvasNodeFlowTypes = canvasNodeFlowTypes,
  VideoNodeFlowTypes = videoFlowTypes,
  FileNodeFlowTypes = fileFlowTypes,
  PictureNodeFlowTypes = pictureFlowTypes,
  PDFNodeFlowTypes = pdfFlowTypes,
  SVGDrawerNodeTypes = svgDrawerNodeTypes,
}

export const nodeTypes = {
  [NodeTypes.CanvasNodeFlowTypes]: CanvasNode,
  [NodeTypes.RectangleNodeFlowTypes]: RectangleNode,
  [NodeTypes.CircleNodeFlowTypes]: CircleNode,
  [NodeTypes.TextNodeFlowTypes]: TextNode,
  [NodeTypes.VideoNodeFlowTypes]: VideoNode,
  [NodeTypes.FileNodeFlowTypes]: FileNode,
  [NodeTypes.PictureNodeFlowTypes]: PictureNode,
  [NodeTypes.PDFNodeFlowTypes]: PDFNode,
  [NodeTypes.SVGDrawerNodeTypes]: SVGDrawerNode,
};
