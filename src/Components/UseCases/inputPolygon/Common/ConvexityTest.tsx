import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { doSegmentsIntersect } from "./Geometry";

/**
 * @returns -1 if the polygon is negatively oriented (vertices listed anticlockwise), 
 *          +1 if the polygon is positively oriented (vertices listed clockwise)
 */
const testOrientation = ( polygon: Vertex[] ) : number => {
    const nVertices = polygon.length;
    const theArea = 0.5*polygon.reduce( 
        (currentArea: number, vertex: Vertex, i: number) => 
            currentArea + vertex[0]*polygon[ (i+1) % nVertices ][1] - vertex[1]*polygon[ (i+1) % nVertices ][0],
        0);
    return Math.sign(theArea);
} 

const triangleAreaSign = ( P1: Vertex, P2: Vertex, P3: Vertex ) : number => {
    const area = 0.5*( P1[0]*P2[1] + P1[1]*P3[0] + P2[0]*P3[1] - ( P2[1]*P3[0] + P1[1]*P2[0] + P1[0]*P3[1]) );
    return Math.sign(area);
}

/**
 * @credits implementing the polygonal simplicity test described in the
 * following article: http://hera.ugr.es/doi/15026760.pdf pp. 2-3 in attempt to fix
 * a bug causing the convexity test to fail for some self-intersecting (thus non-simple) polygons.
 * 
 * Given how a polygon is created I assume the described condition (i) to be
 * always satisfied.
 * 
 */
const isSimple = ( polygon: Vertex[] ) : boolean => {
    const nVertices: number = polygon.length;
    
    if( nVertices <= 3 )
        return true;

    const thePolygon = testOrientation(polygon) > 0 ? polygon : polygon.reverse();
    let verticesWithinSide: boolean = false;

    /**
     * Test if at least a vertex of the polygon lays on one of the sides.
     * @FIXME  replace "doSegmentsIntersect" with a test about parallelism. [Vi->Vk] and [Vi->Vj] 
     *         obviously intersect at least on {Vi}
     */
    for( let i: number=0; !verticesWithinSide && i < nVertices; i++ )
        for( let k: number=0; !verticesWithinSide && k < polygon.length; k++ ) 
            if( i !== k && (i+1) % nVertices !== k) {
                const j: number = (i+1) % nVertices;
                const Vi = thePolygon[i], Vj = thePolygon[j], Vk=thePolygon[k];
                verticesWithinSide = verticesWithinSide ||
                     ( ( Vk[1]-Vi[1] )/( Vk[0]-Vi[0] ) === ( Vj[1]-Vi[1] )/( Vj[0]-Vi[0] ) && doSegmentsIntersect( [Vi, Vk], [Vi, Vj] )) ;            
            }
    
    if( verticesWithinSide )
        return false;

    /**
     * Testing if two sides intercept. The test returns true if at least two sides intercept, false otherwise
     */
    let test3: boolean = false;
    for( let i: number = 0; !test3 && i < nVertices; i++ )
        for( let k:number = 0; !test3 && k < nVertices; k++ ) 
            if( i !== k && (i+1) % nVertices !== k && (k+1) % nVertices !== i) {
                const j: number = (i+1) % nVertices;
                const l: number = (k+1) % nVertices;
                const Vi = thePolygon[i], Vj = thePolygon[j], Vk=thePolygon[k], Vl=thePolygon[l];
                test3 = test3 || (( triangleAreaSign(Vk, Vi, Vj) !== triangleAreaSign(Vl, Vi, Vj) )
                            && ( triangleAreaSign(Vi, Vk, Vl) !== triangleAreaSign(Vj, Vk, Vl) ) )
            }
                
    return !test3;
}

/**
 * @credits this convexity test is based on the following link: 
 * http://www.sunshine2k.de/coding/java/Polygon/Convex/polygon.htm#:~:text=Ok%2C%20so%20to%20check%20the,then%20it%20is%20not%20convex.
 * this may require further testing
 */
export const isConvex = ( polygon: Vertex[] ) : boolean => {
    if( polygon.length < 3 )
        return false;
    else
        if( polygon.length === 3 )
            return true;
        else {
            const nVertices: number = polygon.length;
            let res: number = 0;
            let isConvex: boolean = true;

            if( !isSimple(polygon) ) {
                console.log("Polygon is not simple");
                return false;
            } else {
                console.log("Polygon is simple");
            }

            polygon.forEach( (thisVertex: Vertex, i: number) => {
                const thisV: Vertex = thisVertex;
                const nextV: Vertex = polygon[(i+1) % nVertices];
                const secondNextV: Vertex =  polygon[(i+2) % nVertices];
                const v: Vertex = [nextV[0] - thisV[0], nextV[1] - thisV[1]];

                if( i === 0 )
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

