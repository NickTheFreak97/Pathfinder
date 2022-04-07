import { Point } from "../../GUIElements/Types/Shapes/Point"
import { Segment } from "../../UseCases/InputPolygon/Common/Geometry"
import { extractID } from "./VisibilityMap/VisibilityMap";
import { toVertex } from "../../GUIElements/Types/Shapes/Point";
/**
 * An implementation of the strategy for testing line segments intersection described here: 
 * https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line_segment
 */
const lineSegmentsIntersection = ( S1: Segment, S2: Segment ) : Point | null => {
    const x1: number = S1[0][0];
    const x2: number = S1[1][0];
    const x3: number = S2[0][0];
    const x4: number = S2[1][0];
    const y1: number = S1[0][1];
    const y2: number = S1[1][1];
    const y3: number = S2[0][1];
    const y4: number = S2[1][1];

    const denominator = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
    if( denominator === 0)
        return null;

    const t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4))/denominator;
    const u = ((x1-x3)*(y1-y2) - (y1-y3)*(x1-x2))/denominator;

    if( (t >= 0 && t <= 1) && u >= 0 && u <= 1 )
        return {
            x: x1 + t*(x2-x1),
            y: y1 + t*(y2-y1)
        }
    else
        return null;
}

export const raycast = ( source: Point, obstacles: Segment[], destination: Point ): Point[] | null => {
    if( !source.x || !source.y || !destination.x || !destination.y )
        return null;

    const ray: Segment = [ [source.x!, source.y!], [destination.x!, destination.y!] ];

    const intersections: (Point | null)[] = 
        obstacles.map( obstacle => lineSegmentsIntersection(ray, obstacle) )
            .filter( i => i !== null );

    return intersections as Point[];
}

export const anyVisibleObstacle = ( startPoint: Point, obstacles: Segment[], destinationPoint: Point ) : boolean => {
    const visibleObstacles: Point[] | undefined | false = 
        raycast(startPoint, obstacles, destinationPoint )
            ?.filter( (intersectionPt) => 
            (
                extractID(toVertex(intersectionPt)) !== extractID( toVertex(startPoint) ) &&
                extractID(toVertex(intersectionPt)) !== extractID( toVertex(destinationPoint) ) 
            ) 
        );

    return !( !visibleObstacles || visibleObstacles.length <= 0 );
}