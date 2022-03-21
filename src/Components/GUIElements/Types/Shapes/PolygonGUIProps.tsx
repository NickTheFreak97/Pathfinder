export type Vertex = [number, number];

export type ThreeOrMoreVertices = {
    0: Vertex
    1: Vertex
    2: Vertex
} & Array<Vertex>

export interface PolygonGUIProps {
    points: ThreeOrMoreVertices,
    name: string, 
    fill?: string,
    stroke?: string,
    strokeWidth?: number,
    isDraggable?: boolean,
    onPointSelected?: (pointID: string, pointX: number, pointY: number) => void;
}