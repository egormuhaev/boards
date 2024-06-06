import { useEffect, useId, useRef, useState } from "react";
import { Handle, Position, NodeResizer, NodeProps } from "reactflow";
import { $flow } from "../../flow/store/flow.slice";
import { useUnit } from "effector-react";

const CanvasNode = ({ selected }: NodeProps) => {
  const flowState = useUnit($flow);
  const id = useId();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvasContext = canvasRef.current.getContext("2d");
      if (canvasContext) {
        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = "black";
        setCtx(canvasContext);
      }
    }
  }, []);

  const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    adjustCanvasSize(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    isDrawing.current = true;
    lastPosition.current = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
  };

  const adjustCanvasSize = (x: number, y: number) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      if (x > canvas.width) {
        canvas.width = x + 10;
      }
      if (y > canvas.height) {
        canvas.height = y + 10;
      }
    }
  };

  const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing.current && ctx && flowState.isDrawingMode) {
      const currentPosition = {
        x: event.nativeEvent.offsetX,
        y: event.nativeEvent.offsetY,
      };

      ctx.beginPath();
      ctx.moveTo(lastPosition.current!.x, lastPosition.current!.y);
      ctx.lineTo(currentPosition.x, currentPosition.y);
      ctx.stroke();

      lastPosition.current = currentPosition;

      adjustCanvasSize(currentPosition.x, currentPosition.y);
    }
  };

  const onMouseUp = () => {
    isDrawing.current = false;
    lastPosition.current = null;
  };

  return (
    <>
      <Handle
        hidden={flowState.isDrawingMode}
        type="source"
        position={Position.Top}
        id="f"
      />
      <Handle
        type="source"
        hidden={flowState.isDrawingMode}
        position={Position.Bottom}
        id="a"
      />
      <Handle
        hidden={flowState.isDrawingMode}
        type="source"
        position={Position.Left}
        id="c"
      />
      <Handle
        hidden={flowState.isDrawingMode}
        type="source"
        position={Position.Right}
        id="d"
      />

      <NodeResizer
        isVisible={!flowState.isDrawingMode && selected && !isDrawing.current}
        minWidth={100}
        minHeight={58}
      />
      <div
        style={{
          border: "1px solid black !important",
        }}
        className="h-[100vh] w-[100%]"
        onContextMenu={(e: any) => {
          e.preventDefault();
        }}
      >
        <canvas
          className="h-full w-full"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          id={id}
          ref={canvasRef}
        ></canvas>
      </div>
    </>
  );
};

export const canvasNodeFlowTypes = "canvasNode";

export default CanvasNode;
