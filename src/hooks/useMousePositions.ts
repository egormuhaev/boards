import { useEffect, useState } from "react";

export function useMousePosition() {
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  useEffect(() => {
    const mouseMoveListener = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", mouseMoveListener);
    //document.documentElement.style.setProperty("cursor", "pointer !important");
    return () => {
      document.removeEventListener("mousemove", mouseMoveListener);
    };
  }, []);

  return cursorPosition;
}
