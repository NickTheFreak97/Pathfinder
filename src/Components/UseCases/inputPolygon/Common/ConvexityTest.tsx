import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";

/**
 * @credits this convexity test is based on the following link: 
 * http://www.sunshine2k.de/coding/java/Polygon/Convex/polygon.htm#:~:text=Ok%2C%20so%20to%20check%20the,then%20it%20is%20not%20convex.
 * this may require further testing
 */
export const isConvex = ( polygon: Vertex[] ) : boolean => {
    if( polygon.length < 3 )
        return false;
    else
        if( polygon.length == 3 )
            return true;
        else {
            const nVertices: number = polygon.length;
            let res: number = 0;
            let isConvex: boolean = true;

            polygon.forEach( (thisVertex: Vertex, i: number) => {
                const thisV: Vertex = thisVertex;
                const nextV: Vertex = polygon[(i+1) % nVertices];
                const secondNextV: Vertex =  polygon[(i+2) % nVertices];
                const v: Vertex = [nextV[0] - thisV[0], nextV[1] - thisV[1]];

                if( i == 0 )
                    res = secondNextV[0]*v[1] - secondNextV[1]*v[0] + v[0]*thisV[1] - v[1]*thisV[0];
                else {
                    const newRes: number = secondNextV[0]*v[1] - secondNextV[1]*v[0] + v[0]*thisV[1] - v[1]*thisV[0];
                    if ( (newRes > 0 && res < 0) || (newRes < 0 && res > 0) )
                        isConvex = false;
                }
            } )

            return isConvex;
        }
}