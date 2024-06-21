import { useRef } from "react";
import {
  BaseEdge,
  useEdges,
  useReactFlow,
  useStore,
  type Edge,
  type EdgeProps,
  type XYPosition,
} from "reactflow";
import { $boardPlayground } from "@/flow/store/playground.slice";
import { ControlPoint, type ControlPointData } from "./ControlPoint";
import { getPath, getControlPoints } from "./path";
import { Algorithm, COLORS } from "./constants";
import { useUnit } from "effector-react";
import EdgeToolbar from "../edgesEnviroment/EdgeToolbar";

const useIdsForInactiveControlPoints = (points: ControlPointData[]) => {
  const prevIds = useRef<string[]>([]);

  let newPoints: ControlPointData[] = [];

  if (prevIds.current.length === points.length) {
    newPoints = points.map((point, i) =>
      point.active ? point : { ...point, id: prevIds.current[i] }
    );
  } else {
    newPoints = points.map((prevPoint, i) => {
      const id = window.crypto.randomUUID();
      prevIds.current[i] = id;
      return prevPoint.active ? points[i] : { ...points[i], id };
    });
  }

  return newPoints;
};

export type EditableEdgeData = {
  algorithm?: Algorithm;
  points: ControlPointData[];
  lineColor?: string;
  lineWidth?: number;
};

export function EditableEdge({
  id,
  selected,
  source,
  sourceX,
  sourceY,
  sourcePosition,
  target,
  targetX,
  targetY,
  targetPosition,
  markerEnd,
  markerStart,
  style,
  data = {
    algorithm: Algorithm.Linear,
    points: [],
    lineColor: "#000",
    lineWidth: 2,
  },
  ...delegated
}: EdgeProps<EditableEdgeData>) {
  const sourceOrigin = { x: sourceX, y: sourceY } as XYPosition;
  const targetOrigin = { x: targetX, y: targetY } as XYPosition;
  const { isMovementPlayground } = useUnit($boardPlayground);
  const edges = useEdges();
  const { getZoom, setEdges } = useReactFlow();

  // useEffect(() => {
  // console.log(getZoom());
  // });

  const conditionToolbarVisible = !isMovementPlayground && selected;

  const color = COLORS[data.algorithm ?? Algorithm.BezierCatmullRom];

  const shouldShowPoints = useStore((store) => {
    const sourceNode = store.nodeInternals.get(source)!;
    const targetNode = store.nodeInternals.get(target)!;

    return selected || sourceNode.selected || targetNode.selected;
  });

  const setControlPoints = (
    update: (points: ControlPointData[]) => ControlPointData[]
  ) => {
    const newEdges = edges.map((e) => {
      if (e.id !== id) return e;
      if (!isEditableEdge(e)) return e;

      const points = e.data?.points ?? [];
      const data = { ...e.data, points: update(points) };

      return { ...e, data };
    });

    setEdges(newEdges);
  };

  const pathPoints = [sourceOrigin, ...data.points, targetOrigin];
  const controlPoints = getControlPoints(pathPoints, data.algorithm, {
    fromSide: sourcePosition,
    toSide: targetPosition,
  });
  const path = getPath(pathPoints, data.algorithm, {
    fromSide: sourcePosition,
    toSide: targetPosition,
  });

  const controlPointsWithIds = useIdsForInactiveControlPoints(controlPoints);

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        {...delegated}
        markerStart={markerStart}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: data.lineWidth,
          stroke: data.lineColor,
        }}
      />

      {conditionToolbarVisible && (
        <EdgeToolbar
          settings={{
            x1: (sourceX + targetX) / 2 + 100 * getZoom(),
            y1: (sourceY + targetY) / 2 + 100 * getZoom(),
            lineColor: data.lineColor,
            lineWidth: data.lineWidth,
            algorithm: data.algorithm,
          }}
          id={id}
        />
      )}

      {shouldShowPoints &&
        controlPointsWithIds.map((point, index) => (
          <ControlPoint
            key={point.id}
            index={index}
            setControlPoints={setControlPoints}
            color={color}
            {...point}
          />
        ))}
    </>
  );
}

const isEditableEdge = (edge: Edge): edge is Edge<EditableEdgeData> =>
  edge.type === "editableEdge";
