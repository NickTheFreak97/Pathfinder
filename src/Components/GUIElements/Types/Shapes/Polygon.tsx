import Konva from "konva"
import { ThreeOrMoreVertices } from "./PolygonGUIProps";

export interface Polygon {
    id: string,
    vertices: ThreeOrMoreVertices,
    isConvex?: boolean,
    pointInside?: boolean,
    transform?: Konva.Transform | null,
}
