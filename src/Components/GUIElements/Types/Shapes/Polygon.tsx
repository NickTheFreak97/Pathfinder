import { ThreeOrMoreVertices } from "./PolygonGUIProps";

export interface Polygon {
    id: string,
    vertices: ThreeOrMoreVertices,
    isConvex?: boolean,
}
