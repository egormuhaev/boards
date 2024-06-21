import { useMousePosition } from "@/hooks/useMousePositions";
import { Pen } from "lucide-react";

export default function DrawPenCursor() {
  const cursorPosition = useMousePosition();

  return (
    <Pen
      className="h-[20px] w-[20px] fixed pointer-events-none"
      style={{
        left: `${cursorPosition.x - 5}px`,
        top: `${cursorPosition.y - 15}px`,
        zIndex: 10000,
      }}
    />
  );
}
