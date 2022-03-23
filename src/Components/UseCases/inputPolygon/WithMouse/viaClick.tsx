import Konva from "konva";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { store } from "../../../Redux/Store/store";

import { onAreaClosed, onAreaNotClosed } from '../Common/AreaClosed';

/**
 * @disclaimer
 * This code is inspired to the following link:
 * https://stackoverflow.com/questions/69795950/react-konva-free-hand-area-selection-using-mouse-click-straight-lines
 * integrating both the question and the selected answer's codes, adapted to work with typescript and Redux
 */
const tollerance = 10;

export const isInside = (
  center: Vertex,
  rad: number,
  point: Vertex
): boolean => {
  if (!center || !point) return false;

  if (
    (point[0] - center[0]) * (point[0] - center[0]) +
      (point[1] - center[1]) * (point[1] - center[1]) <=
    rad * rad
  )
    return true;
  else return false;
};

export const inputPolygonViaClick = (
  event: Konva.KonvaEventObject<MouseEvent>
): boolean => {
  const clickCoords = event.target?.getStage()?.getPointerPosition();
  if (!clickCoords?.x || !clickCoords.y) return false;

  if (event.evt.button !== 2 && event.target.getStage()) {
    const theVertices: Vertex[] = store.getState().newPolygonVertices;

    let areaClosed = theVertices.reduce(
      (isAreaClosed: boolean, vertex: Vertex) => {
        return (
          isAreaClosed ||
          isInside(vertex, tollerance, [clickCoords!.x, clickCoords!.y])
        );
      },
      false
    );

    if (areaClosed && theVertices.length >= 3) {
      onAreaClosed();
    } else 
      if (!areaClosed) 
        onAreaNotClosed([clickCoords!.x, clickCoords!.y]);

    return areaClosed;
  } else return false;
};

export const isAreaClosed = (vertices: Vertex[], nextPoint: Vertex) => {
  return vertices.reduce(
    (isAreaClosed: boolean, vertex: Vertex) => {
      return (
        isAreaClosed ||
        isInside(vertex, tollerance, nextPoint)
      );
    },
    false
  );
} 
