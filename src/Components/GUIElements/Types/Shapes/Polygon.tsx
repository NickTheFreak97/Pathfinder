import Konva from "konva"
import { ThreeOrMoreVertices } from "./PolygonGUIProps";

export interface Polygon {
    id: string,
    vertices: ThreeOrMoreVertices,
    transformedVertices: ThreeOrMoreVertices,
    isConvex?: boolean,
    pointInside?: boolean,
    overlappingPolygonsID: string[],
    transform?: Konva.Transform | null,
    isRandom?: boolean,
}
