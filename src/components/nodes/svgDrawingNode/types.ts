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
