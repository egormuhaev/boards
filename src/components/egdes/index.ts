import { ConnectionLine } from "./ConectionLine";
import { EditableEdge, editableEdgeFlowTypes } from "./EditableEdge";

export { ConnectionLine };

export enum EdgeTypes {
  EditableEdgeFlowTypes = editableEdgeFlowTypes,
}

export const edgeTypes = {
  [EdgeTypes.EditableEdgeFlowTypes]: EditableEdge,
};
