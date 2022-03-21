export interface PointGUIProps {
  x: number;
  y: number;
  name: string;
  stroke?: string;
  innerStroke?: string;
  innerFill?: string;
  outerFill?: string;
  onPointSelected: (pointID: string, pointX: number, pointY: number) => void;
  isDraggable?: boolean;
  onDragEnd?: (pointID: string, pointX: number, pointY: number) => void;
}
