import { Point } from "../../GUIElements/Types/Shapes/Point"
import { Segment } from "../../UseCases/InputPolygon/Common/Geometry"
import { extractID } from "./VisibilityMap/VisibilityMap";
import { toVertex } from "../../GUIElements/Types/Shapes/Point";
import { toPoint } from "../../GUIElements/Types/Shapes/PolygonGUIProps";

type Range_t = [number, number];

/** Tests if the two ranges passed as parameter do overlap */
export const doRangesOverlap = ( rangeA: Range_t, rangeB: Range_t ) => {   
    if(Math.max(rangeA[1], rangeB[1]) - Math.min(rangeA[0], rangeB[0]) < (rangeA[1] - rangeA[0]) + (rangeB[1] - rangeB[0]))
        return true;
    else 
        return false;
}

/* Tests if the given point falls within the specified segment */
export const isBetween = (segment: Segment, point: Point): boolean => {

    const crossProd: number = (point.y! - segment[0][0]) * (segment[1][0] - segment[0][0]) - (point.x! - segment[0][0]) * (segment[1][1] - segment[0][1])
    if( crossProd > Math.sqrt(Number.EPSILON) )
        return false;

    const dotProd: number = (point.x! - segment[0][0]) * (segment[1][0] - segment[0][0]) + (point.y! - segment[0][1])*(segment[1][1] - segment[0][1])

    if( dotProd <  0 )
        return false;

    const squaredlengthBA: number = (segment[1][0] - segment[0][0])*(segment[1][0] - segment[0][0]) + (segment[1][1] - segment[0][1])*(segment[1][1] - segment[0][1]); 
    if (dotProd > squaredlengthBA)
        return false

    return true
}  

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
        if( doRangesOverlap( [S1[0][0], S1[1][0]], [S2[0][0], S2[1][0]] ) 
            && doRangesOverlap( [S1[0][1], S1[1][1]], [S2[0][1], S2[1][1]]) ) 
            if( isBetween(S1, {
                x: S2[0][0],
                y: S2[0][1]
            }) )
                return toPoint(S2[0])
            else
                return toPoint(S1[0])

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

    console.log( "obstacles between ", startPoint, " and ", destinationPoint, ": ", visibleObstacles );

    return !( !visibleObstacles || visibleObstacles.length <= 0 );
}