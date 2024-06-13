import { rectangleNodeFlowTypes } from "./RectangleNode";
import { canvasNodeFlowTypes } from "./CanvasNode";
import { textNodeFlowTypes } from "./TextNode";
import { videoFlowTypes } from "./VideoNode";
import { fileFlowTypes } from "./FileNode";
import { pictureFlowTypes } from "./PictureNode";
import { pdfFlowTypes } from "./PDFNode";
import { circleNodeFlowTypes } from "./CircleNode";

export enum NodeTypes {
  RectangleNodeFlowTypes = rectangleNodeFlowTypes,
  CircleNodeFlowTypes = circleNodeFlowTypes,
  TextNodeFlowTypes = textNodeFlowTypes,
  CanvasNodeFlowTypes = canvasNodeFlowTypes,
  VideoNodeFlowTypes = videoFlowTypes,
  FileNodeFlowTypes = fileFlowTypes,
  PictureNodeFlowTypes = pictureFlowTypes,
  PDFNodeFlowTypes = pdfFlowTypes,
}
