import { v4 as uuidv4 } from "uuid";
import { store } from "../../../Redux/Store/store";

import { setCurrentPoint } from "../Actions/setCurrentPoint";
import { updateVertices } from "../Actions/updateVertices";
import { addPolygon } from "../Actions/addPolygon";
import { isConvex } from "./ConvexityTest";

import { ThreeOrMoreVertices } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Polygon } from "../../../GUIElements/Types/Shapes/Polygon";

export const onAreaClosed = () => {
  const vertices: Vertex[] = store.getState().newPolygonVertices;

  store.dispatch(setCurrentPoint(undefined));
  store.dispatch(updateVertices([]));
  store.dispatch(
    addPolygon({
      id: uuidv4(),
      vertices: vertices as ThreeOrMoreVertices,
      transformedVertices: vertices as ThreeOrMoreVertices,
      isConvex: isConvex(vertices),
    })
  );
};

export const onAreaNotClosed = (nextVertex: Vertex) => {
  const vertices = store.getState().newPolygonVertices;

  store.dispatch(updateVertices([...vertices, nextVertex]));
  store.dispatch(setCurrentPoint(nextVertex));
};
