import { Vector2D } from "./Utils/Vector2D";
import { MinMax, getNormals, getSides, projectOntoAxis } from "./Utils/SATUtils";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";

export const SATCollisionTest = ( polyA: Polygon, polyB: Polygon ): boolean => {

    const polyASides: Vector2D[] = getSides( polyA );
    const polyBSides: Vector2D[] = getSides( polyB );

    const axes: Vector2D[] = [ ...getNormals(polyA, polyASides), ...getNormals(polyB, polyBSides) ];

    for( let i=0; i < axes.length; i++ ) {
        const polyAProj: MinMax = projectOntoAxis( polyA, axes[i], polyASides );
        const polyBProj: MinMax = projectOntoAxis( polyB, axes[i], polyBSides );
        
        if( polyAProj.min.gt(polyBProj.max) || polyBProj.min.gt(polyAProj.max) )
            return false;
    }

    return true;
}