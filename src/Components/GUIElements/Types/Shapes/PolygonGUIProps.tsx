import Konva from "konva";
import { RandomPolyCircleItem } from "../../../UseCases/RandomScene/addRandonPolygonCircle";
import { Point } from "./Point";

export type Vertex = [number, number];

export type ThreeOrMoreVertices = {
    0: Vertex
    1: Vertex
    2: Vertex
} & Array<Vertex>

export interface PolygonGUIProps {
    randomPolygonsInfo?: {
        [key: string]: RandomPolyCircleItem,
    },
    points: ThreeOrMoreVertices,
    name: string, 
    fill?: string,
    errorFill?: string,
    errorStroke?: string,
    stroke?: string,
    isRandom?: boolean,
    strokeWidth?: number,
    isDraggable?: boolean,
    onPointSelected?: (pointID: string, pointX: number, pointY: number) => void,
    setTransform: (polygonID: string, transform: Konva.Transform) => void,
    error?: boolean,
}

export const toPoint = (vertex: Vertex) : Point => {
    return {
        x: vertex[0],
        y: vertex[1],
    }
}