import { useUnit } from "effector-react";
import { memo, useCallback, useState } from "react";
import { IoAnalyticsOutline } from "react-icons/io5";
import { TbVectorSpline } from "react-icons/tb";
import { BlockPicker, ColorResult } from "react-color";
import { Button } from "@/shadcn/ui/button";

import { $boardPlayground, changeEdge } from "@/flow/store/playground.slice";
import { createPortal } from "react-dom";
import { $flow } from "@/flow/store/flow.slice";
import { Algorithm } from "../EditableEdge/constants";

interface EdgeToolbarProps {
  id: string;
  labelX: number;
  labelY: number;
  settings: Settings;
}

interface Settings {
  lineColor?: string;
  lineWidth?: number;
  algorithm?: Algorithm;
}

export default function EdgeToolbar({
  labelX,
  labelY,
  id,
  settings,
}: EdgeToolbarProps) {
  const playgroundState = useUnit($boardPlayground);
  const flowState = useUnit($flow);

  const changeLineWidth = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newEdges = playgroundState.edges.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              lineWidth: +e.target.value,
            },
          };
        }
        return node;
      });

      changeEdge([...newEdges]);
    },
    [settings.lineWidth, playgroundState.edges],
  );

  const changeLineType = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newEdges = playgroundState.edges.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              algorithm: e.target.value,
            },
          };
        }
        return node;
      });

      changeEdge([...newEdges]);
    },
    [settings.lineWidth, playgroundState.edges],
  );

  const changeEdgeColor = useCallback(
    (color: ColorResult) => {
      if (!flowState.isDrawingMode) {
        const newEdges = playgroundState.edges.map((edgs) => {
          if (edgs.id === id) {
            return {
              ...edgs,
              data: {
                ...edgs.data,
                lineColor: color.hex,
              },
            };
          }
          return edgs;
        });

        changeEdge([...newEdges]);
      }
    },
    [playgroundState.edges, settings.lineColor],
  );

  return createPortal(
    <div
      style={{
        position: "absolute",
        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY - 100}px)`,
        top: 0,
        left: 0,
        padding: 10,
        borderRadius: 5,
        fontSize: 12,
        fontWeight: 700,
      }}
      className="nodrag nopan flex flex-row gap-2 justify-center p-2 items-center bg-white border border-solid-1 border-slate-300 rounded-lg h-10 box-border"
    >
      <ColorPickerButton
        pickHandler={changeEdgeColor}
        color={settings.lineColor ?? "#000"}
      />

      <LineWidthSelect
        lineWidth={settings.lineWidth ?? 2}
        clickHandler={changeLineWidth}
      />

      <LineTypeSelect
        algorithm={settings.algorithm ?? Algorithm.Linear}
        algorithmHandler={changeLineType}
      />
    </div>,
    document.body,
  );
}

const LineTypeSelect = memo(
  ({
    algorithm,
    algorithmHandler,
  }: {
    algorithm: Algorithm;
    algorithmHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => {
    const lineTypes: Record<string, string> = {
      [Algorithm.Linear]: "Linear",
      [Algorithm.BezierCatmullRom]: "BezierCatmullRom",
    };
    return (
      <select value={algorithm} onChange={algorithmHandler}>
        {Object.keys(lineTypes).map((type) => {
          return (
            <option
              key={type}
              value={type}
              className={type === algorithm ? `bg-slate-300` : undefined}
            >
              {lineTypes[type]}
            </option>
          );
        })}
      </select>
    );
  },
);

const LineWidthSelect = memo(
  ({
    lineWidth,
    clickHandler,
  }: {
    lineWidth: number;
    clickHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => {
    const values: number[] = [...Array(100)]
      .map((_, i) => i + 1)
      .filter((val) => val % 2 === 0);

    return (
      <select value={lineWidth} onChange={clickHandler}>
        {values.map((val) => (
          <option
            key={val}
            value={val}
            className={val === lineWidth ? `bg-slate-300` : undefined}
          >
            {val + "px"}
          </option>
        ))}
      </select>
    );
  },
);

const ColorPickerButton = memo(
  ({
    color,
    pickHandler,
    icon,
  }: {
    color: string;
    pickHandler: (color: ColorResult) => void;
    icon?: JSX.Element;
  }) => {
    const playgroundState = useUnit($boardPlayground);
    const [visibleColorPicker, setVisibleColorPicker] = useState(false);

    return (
      <Button
        style={{
          backgroundColor: color,
        }}
        onMouseEnter={() => {
          setVisibleColorPicker(true);
        }}
        onMouseLeave={() => {
          setVisibleColorPicker(false);
        }}
        className="h-full aspect-square p-[1px] bg-yellow-400 hover:bg-yellow-300 rounded-lg relative"
      >
        {icon}

        {visibleColorPicker && (
          <div className="absolute h-auto w-auto top-0 translate-y-7 ">
            <BlockPicker
              color={color}
              colors={playgroundState.colorsPalet.map(
                (color: string) => "#" + color,
              )}
              onChangeComplete={(e) => {
                pickHandler(e);
                setVisibleColorPicker(false);
              }}
            />
          </div>
        )}
      </Button>
    );
  },
);
