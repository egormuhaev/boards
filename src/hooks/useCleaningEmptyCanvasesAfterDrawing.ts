import { useReactFlow, Node } from "reactflow";

export function useCleaningEmptyCanvasesAfterDrawing() {
  const { setNodes } = useReactFlow();

  return () => {
    setNodes((nodes: Node[]) => {
      return nodes.filter(
        (node: Node) =>
          node.type !== "drawing" ||
          (node.type === "drawing" && node.data.points?.length > 3),
      );
    });
  };
}
