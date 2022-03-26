import { Polygon } from "../Shapes/Polygon";
import { InteractionMode } from "../../../Utils/interactionMode";
import { Vertex } from "../Shapes/PolygonGUIProps";
import { PointInfo } from "../Shapes/PointInfo";

export interface State {
    polygons: Polygon[],
    useMode: InteractionMode,
    currentPoint: Vertex | null | undefined,
    newPolygonVertices: Vertex [],
    selectedPolygonID: string | null | undefined,
    startPoint: PointInfo | null | undefined,
    destinationPoint: PointInfo | null | undefined,
}