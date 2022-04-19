import Konva from "konva";
import { validate } from "uuid";
import { anyVisibleObstacle } from "../Raycasting";
import { toPoint } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { toVertex } from "../../../GUIElements/Types/Shapes/Point";
import { polygonsToObstacleSegments, polygonsToAllVertices } from "./utils";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Polygon } from "../../../GUIElements/Types/Shapes/Polygon";
import { Segment } from "../../../UseCases/InputPolygon/Common/Geometry";
import { Point } from "../../../GUIElements/Types/Shapes/Point";
import { PointInfo } from "../../../GUIElements/Types/Shapes/PointInfo";

export interface VisibilityMap {
    [key: string]: Vertex[]
}

export const extractID = ( vertex: Vertex ) : string => {
    return `(${vertex[0].toFixed(5)},${vertex[1].toFixed(5)})`;
}

export const extractPoint = ( pointID: string ) : Vertex => {
    const coordinates: string[] = pointID.replace('(', '').split(',');
    return [ parseFloat(coordinates[0]), parseFloat(coordinates[1].replace(')', '')) ];
}

/**
 * @fixme When the starting or destination point matches the vertex of a polygon and it got transformed
 *        or moved, the corresponding visibility graph won't get updated. 
 */
export const getVisibilityMap = (polygons: Polygon[], startPoint: PointInfo | null | undefined, destinationPoint: PointInfo | null | undefined) : VisibilityMap => {
    const visibilityMap: VisibilityMap = {};
    const obstacles: Segment[] = polygonsToObstacleSegments(polygons);
    
    for( let i=0; i < polygons.length; i++ ) {
        const pVerticesCount: number = polygons[i].transformedVertices.length;

        for( let j=0; j < polygons.length; j++ ) {

            for( let p=0; p < polygons[i].transformedVertices.length; p++ ) {

                /** The first time you find a vertex you'll add the two adjacent points to its visibility set */
                const pID: string = extractID(polygons[i].transformedVertices[p]);

                if( !(pID in visibilityMap) ) {
                    Object.assign( visibilityMap, { [pID]: [] } );
                    visibilityMap[pID].push( polygons[i].transformedVertices[(p+1)% pVerticesCount] );
                    visibilityMap[pID].push( polygons[i].transformedVertices[(p-1+pVerticesCount)% pVerticesCount] );
                }

                if( i == j )
                    continue;

                for( let q=0; q < polygons[j].transformedVertices.length; q++ ) {
                    if( !anyVisibleObstacle( toPoint(polygons[i].transformedVertices[p]), obstacles, toPoint(polygons[j].transformedVertices[q]) ) )
                        visibilityMap[pID].push( polygons[j].transformedVertices[q] );
                }
            }

        }
    }

    if( !!startPoint && validate(startPoint.id) ) {
        const startPtID: string = extractID( toVertex(startPoint.coordinates) );
        if( !( startPtID in visibilityMap ) )
            Object.assign( visibilityMap, { [startPtID]: [] } );

        const visibleVertices: Vertex[] = getStartPointVisibilityMap( startPoint, polygons, obstacles );
        visibleVertices.forEach(
            (v: Vertex) => {
                const vertexID: string = extractID( v );
                visibilityMap[startPtID].push(v);
                visibilityMap[vertexID].push( toVertex(startPoint.coordinates) );
            }
        )
    }

    if( !!destinationPoint && validate(destinationPoint.id) ) {
        const destPtID: string = extractID( toVertex(destinationPoint.coordinates) );
        if( !( destPtID in visibilityMap ) )
            Object.assign( visibilityMap, { [destPtID]: [] } );

        const visibleVertices: Vertex[] = getStartPointVisibilityMap( destinationPoint, polygons, obstacles );
        visibleVertices.forEach(
            (v: Vertex) => {
                const vertexID: string = extractID( v );
                visibilityMap[destPtID].push(v);
                visibilityMap[vertexID].push( toVertex(destinationPoint.coordinates) );
            }
        )
    }

    return visibilityMap;
}

const getStartPointVisibilityMap = ( startPoint: PointInfo, polygons: Polygon[], obstacles: Segment[] ): Vertex[] => {
        const allVertices: Vertex[] = polygonsToAllVertices(polygons);
        const visibleVertices: Vertex[] = [];

        if( !!startPoint && validate(startPoint.id) ) {

            allVertices.forEach(
                (vertex: Vertex) => {
                    if( !anyVisibleObstacle(startPoint.coordinates, obstacles, toPoint(vertex)) )
                        visibleVertices.push(vertex);
                }
            )

            return visibleVertices;

        } else 
            return [];
}