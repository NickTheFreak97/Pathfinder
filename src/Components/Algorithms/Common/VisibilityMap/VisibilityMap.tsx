import { validate } from "uuid";
import { anyVisibleObstacle } from "../Raycasting";
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
    return `(${vertex[0]},${vertex[1]})`;
}

export const extractPoint = ( pointID: string ) : Vertex => {
    const coordinates: string[] = pointID.replace('(', '').split(',');
    return [ parseFloat(coordinates[0]), parseFloat(coordinates[1].replace(')', '')) ];
}

export const getVisibilityMap = (polygons: Polygon[], startPoint: PointInfo | null | undefined, destinationPoint: PointInfo | null | undefined) : VisibilityMap => {
    const visibilityMap: VisibilityMap = {};
    const obstacles: Segment[] = polygonsToObstacleSegments( polygons );
    
    for( let i:number =0; i < polygons.length; i++ )
        for( let k:number=0; k < polygons.length; k++ ) {

            for( let p:number=0; p < polygons[i].vertices.length; p++ ) {
                const PiVerticesCount: number = polygons[i].vertices.length;
                const pointID: string = extractID(polygons[i].vertices[p]);
                
                if( !( pointID in visibilityMap ) )
                    Object.assign( visibilityMap, { [pointID]: [] } );

                if( k==0 ) {
                    visibilityMap[pointID].push(polygons[i].vertices[(p+1) % PiVerticesCount]);
                    visibilityMap[pointID].push(polygons[i].vertices[(p-1+PiVerticesCount) % PiVerticesCount]);
                }

                if( polygons[i].id === polygons[k].id )
                    continue;

                const startVertex: Point = { 
                    x: polygons[i].vertices[p][0],
                    y: polygons[i].vertices[p][1]
                }

                for( let q:number=0; q < polygons[k].vertices.length; q++ ) {

                    const destinationVertex: Point = {
                        x: polygons[k].vertices[q][0],
                        y: polygons[k].vertices[q][1]
                    }

                    if( !anyVisibleObstacle( startVertex, obstacles, destinationVertex ) )
                        visibilityMap[pointID].push([ destinationVertex.x!, destinationVertex.y!]);
                }
            }
        }    

        if( !!startPoint && validate(startPoint.id) ) {

            const startID = extractID([startPoint.coordinates.x!, startPoint.coordinates.y!]);
            visibilityMap[ startID ] = getStartPointVisibilityMap( startPoint, polygons, obstacles );

            visibilityMap[ startID ].forEach( (vertex: Vertex) => {
                const vertexID: string = extractID(vertex);
                visibilityMap[ vertexID ].push( [startPoint.coordinates.x!, startPoint.coordinates.y!] );
            } )
        }

        if( !!destinationPoint && validate(destinationPoint.id) ) {
            
            const destinationID = extractID( [destinationPoint.coordinates.x!, destinationPoint.coordinates.y!] )
            visibilityMap[ destinationID ] = getStartPointVisibilityMap( destinationPoint, polygons, obstacles ); 

            visibilityMap[ destinationID ].forEach( (vertex: Vertex) => {
                const vertexID: string = extractID(vertex);
                visibilityMap[ vertexID ].push( [destinationPoint.coordinates.x!, destinationPoint.coordinates.y!] );
            } )
        }

        if( !!startPoint && validate(startPoint.id) && !!destinationPoint && validate(destinationPoint.id) ) {
            const startID = extractID([startPoint.coordinates.x!, startPoint.coordinates.y!]);
            if( !anyVisibleObstacle( startPoint.coordinates, obstacles, destinationPoint.coordinates ) )
                visibilityMap[ startID ].push([destinationPoint.coordinates.x!, destinationPoint.coordinates.y!]);
        }

        return visibilityMap;
}

const getStartPointVisibilityMap = ( startPoint: PointInfo, polygons: Polygon[], obstacles: Segment[] ): Vertex[] => {
        const allVertices: Vertex[] = polygonsToAllVertices( polygons );
        const visibleVertices: Vertex[] = [];
    
        for( let i:number=0; i < allVertices.length; i++ ) {
            const destinationVertex: Point = {
                x: allVertices[i][0],
                y: allVertices[i][1]
            }

            if( !anyVisibleObstacle( startPoint.coordinates, obstacles, destinationVertex ) )
                visibleVertices.push([destinationVertex.x!, destinationVertex.y!]);

        }

        return visibleVertices;
}