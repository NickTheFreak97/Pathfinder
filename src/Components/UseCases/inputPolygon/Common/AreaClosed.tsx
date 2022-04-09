import { v4 as uuidv4 } from "uuid";
import { store } from "../../../Redux/Store/store";

import { setCurrentPoint } from "../Actions/setCurrentPoint";
import { updateVertices } from "../Actions/updateVertices";
import { addPolygon } from "../Actions/addPolygon";
import { isConvex } from "./ConvexityTest";
import { pointInPolygon } from "../../PointInPolygon/pointInPolygon";

import { ThreeOrMoreVertices } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { PointInfo } from "../../../GUIElements/Types/Shapes/PointInfo";
import { Polygon } from "../../../GUIElements/Types/Shapes/Polygon";

export const onAreaClosed = () => {
  const vertices: Vertex[] = store.getState().newPolygonVertices;
  const startPoint: PointInfo | null | undefined = store.getState().startPoint;
  const destinationPoint: PointInfo | null | undefined = store.getState().destinationPoint;

  const newPoly: Polygon = {
    id: uuidv4(),
    vertices: vertices as ThreeOrMoreVertices,
    isConvex: isConvex(vertices),
  };

  let pointInside: boolean = false;
  if( !!startPoint )
    pointInside = pointInside || pointInPolygon( startPoint.coordinates, newPoly );

  if( !!destinationPoint )
    pointInside = pointInside || pointInPolygon( destinationPoint.coordinates, newPoly );
  
  Object.assign( newPoly, { pointInside: pointInside } );

  store.dispatch(setCurrentPoint(undefined));
  store.dispatch(updateVertices([]));
  store.dispatch(
    addPolygon(newPoly)
  );
};

export const onAreaNotClosed = (nextVertex: Vertex) => {
  const vertices = store.getState().newPolygonVertices;

  store.dispatch(updateVertices([...vertices, nextVertex]));
  store.dispatch(setCurrentPoint(nextVertex));
};
