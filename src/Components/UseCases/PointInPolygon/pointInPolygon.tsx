import Konva from "konva";
import _ from "lodash";
import { raycast } from "../../Algorithms/Common/Raycasting";
import { toVertex } from "../../GUIElements/Types/Shapes/Point";
import { toPoint } from "../../GUIElements/Types/Shapes/PolygonGUIProps";

import { Segment } from "../InputPolygon/Common/Geometry";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { Vertex } from "../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Point } from "../../GUIElements/Types/Shapes/Point";

export const pointInPolygon = ( point: Point, polygon: Polygon ) : boolean => {
    const verticesCount: number = polygon.vertices.length;

    const obstacles: Segment[] = 
        polygon.vertices.map(
            (vertex: Vertex, i: number): Segment => {
                if( !!polygon.transform )
                    return [
                        toVertex(
                            (polygon.transform as Konva.Transform)
                                .point( toPoint(vertex) as Konva.Vector2d )
                        ),
                        
                        toVertex(
                            (polygon.transform as Konva.Transform)
                                .point( toPoint(polygon.vertices[(i+1)%verticesCount]) as Konva.Vector2d )
                        )
                    ];
                else
                    return [ polygon.vertices[i], polygon.vertices[(i+1)%verticesCount] ];
            }
        )

        let pointInside: boolean = true;
        obstacles.forEach(
            (obstacle: Segment) => {
                const obstaclesIntersections: Point[] | null =  raycast( point, obstacles, {
                    x: (obstacle[0][0]+obstacle[1][0])/2,
                    y: (obstacle[0][1]+obstacle[1][1])/2,
                } );

                pointInside = pointInside && 
                               obstaclesIntersections!.length <= 1;
            }
        )

        return pointInside;    
}