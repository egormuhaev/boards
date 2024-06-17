export interface Point {
  x: number;
  y: number;
}

export interface PlotSize {
  width: number;
  height: number;
}

export interface SvgPolylineProps {
  points: Point[];
  isCompletedDrawing: boolean;
}

export interface Props {
  plotSize?: PlotSize;
  points?: Point[];
  isCompletedDrawing?: boolean;
  isDrawing?: boolean;
}
