import { Node } from "reactflow";

export function getNodeById(id: string, nodes: Node[]): Node<any> {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  return { ...nodeMap.get(id) } as Node;
}
