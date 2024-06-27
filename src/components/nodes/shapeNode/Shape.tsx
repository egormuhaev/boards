import { Circle, Rectangle } from "./shapes";
import { ShapeProps } from "./shapes/types";

export const ShapeComponents = {
  circle: Circle,
  rectangle: Rectangle,
};

export type ShapeType = keyof typeof ShapeComponents;
export type ShapeComponentProps = Partial<ShapeProps> & { type: ShapeType };

const Shape = ({
  type,
  width,
  height,
  children,
  ...svgAttributes
}: ShapeComponentProps) => {
  const ShapeComponent = ShapeComponents[type];

  if (!ShapeComponent || !width || !height) {
    return null;
  }

  const strokeWidth = svgAttributes.strokeWidth
    ? +svgAttributes.strokeWidth
    : 0;

  const innerWidth = width - 2 * strokeWidth;
  const innerHeight = height - 2 * strokeWidth;

  return (
    <svg width={width} height={height} className="shape-svg">
      <g
        transform={`translate(${svgAttributes.strokeWidth ?? 0}, ${
          svgAttributes.strokeWidth ?? 0
        })`}
      >
        <ShapeComponent
          width={innerWidth}
          height={innerHeight}
          {...svgAttributes}
        />
      </g>
    </svg>
  );
};

export default Shape;
