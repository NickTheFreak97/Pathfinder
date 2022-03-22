import { Polygon } from "../Shapes/Polygon";
import { InteractionMode } from "../../../Utils/interactionMode";
import { Vertex } from "../Shapes/PolygonGUIProps";

export interface State {
    polygons: Polygon[],
    useMode: InteractionMode,
    currentPoint: Vertex | null | undefined,
    newPolygonVertices: Vertex [],
}