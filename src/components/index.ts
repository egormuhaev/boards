import { rectangleNodeFlowTypes } from "./nodes/RectangleNode";
import { canvasNodeFlowTypes } from "./nodes/CanvasNode";
import { textNodeFlowTypes } from "./nodes/TextNode";
import { videoFlowTypes } from "./nodes/VideoNode";
import { fileFlowTypes } from "./nodes/FileNode";
import { pictureFlowTypes } from "./nodes/PictureNode";
import { pdfFlowTypes } from "./nodes/PDFNode";

export enum NodeTypes {
  RectangleNodeFlowTypes = rectangleNodeFlowTypes,
  TextNodeFlowTypes = textNodeFlowTypes,
  CanvasNodeFlowTypes = canvasNodeFlowTypes,
  VideoNodeFlowTypes = videoFlowTypes,
  FileNodeFlowTypes = fileFlowTypes,
  PictureNodeFlowTypes = pictureFlowTypes,
  PDFNodeFlowTypes = pdfFlowTypes,
}
