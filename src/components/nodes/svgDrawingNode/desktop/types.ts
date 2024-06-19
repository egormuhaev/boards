export interface Point {
  x: number;
  y: number;
}

export interface PlotSize {
  width: number;
  height: number;
}

export interface BaseLineProps {
  lineWidth: number;
  lineColor: string;
}

export interface SvgPolylineProps extends BaseLineProps {
  points: Point[];
  isCompletedDrawing: boolean;
}

export interface SvgPathProps extends BaseLineProps {
  path: string;
  isCompletedDrawing: boolean;
}

export interface Props {
  plotSize?: PlotSize;
  points?: Point[];
  isCompletedDrawing?: boolean;
  isDrawing?: boolean;
  lineWidth?: number;
  lineColor?: string;
}
