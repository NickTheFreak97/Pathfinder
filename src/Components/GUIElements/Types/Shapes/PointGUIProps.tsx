export interface PointGUIProps {
  x: number,
  y: number,
  name: string,
  error?: boolean,
  stroke?: string,
  innerRadius?: number,
  outerRadius?: number,
  startInnerFill?: string,
  startOuterFill?: string,
  destInnerFill?: string,
  destOuterFill?: string,
  errorInnerFill?: string,
  errorOuterFill?: string,
  innerStroke?: string;
  innerFill?: string;
  outerFill?: string;
  onPointSelected: (pointID: string, pointX: number, pointY: number) => void;
  isDraggable?: boolean;
  onDragEnd?: (pointID: string, pointX: number, pointY: number) => void;
  scaleX: number,
  scaleY: number,
}
