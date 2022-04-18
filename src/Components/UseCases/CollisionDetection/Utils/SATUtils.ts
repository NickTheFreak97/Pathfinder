import Big from "big.js"
import { Polygon } from "../../../GUIElements/Types/Shapes/Polygon"
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps"
import { Vector2D, segmentToV2D } from "./Vector2D"

export interface MinMax {
    min: Big,
    max: Big,
}

export const getSides = ( polygon: Polygon ) : Vector2D[] => {
    return polygon.transformedVertices.map(
        (vertex: Vertex, i: number, vertices: Vertex[]) => 
            segmentToV2D( [ vertex, vertices[(i+1) % vertices.length] ] )
    )
}

export const getNormals = ( polygon: Polygon, sides?: Vector2D[] ) : Vector2D[] => {
    const polySides: Vector2D[] = !!sides? sides : getSides(polygon); 

    return polySides.map(
        (side: Vector2D): Vector2D => side.normal()!.normalize()!
    );
}

export const projectOntoAxis = (shape: Polygon, axis: Vector2D, sides?: Vector2D[]): MinMax => {

    const polySides: Vector2D[] = !!sides?  sides : getSides(shape);
    
    let min: Big = polySides[0].projectOnto(axis).add( polySides[0].getApplicationPt()!.projectOnto(axis) );
    let max: Big = min;

    for( let i=1; i < polySides.length; i++ ) {
        const projectedOffset: Big = polySides[i].getApplicationPt()?.projectOnto(axis)!;
        const sProjection = polySides[i].projectOnto(axis);

        if( sProjection.add(projectedOffset).lt(min) )
            min = sProjection.add(projectedOffset);
        if( sProjection.add(projectedOffset).gt(max) )
            max = sProjection.add(projectedOffset);
    }

    return { 
        min: min,
        max: max 
    }
}