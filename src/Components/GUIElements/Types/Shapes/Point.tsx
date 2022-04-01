import { Vertex } from "./PolygonGUIProps";

export interface Point {
    x?: number,
    y?: number,
}

export const toVertex = ( point: Point ) : Vertex => {
    return [ point.x || -Infinity, point.y || -Infinity]
}