import Konva from "konva";
import { toPoint } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Box } from "../box";
import { Polygon } from "../../../GUIElements/Types/Shapes/Polygon";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Vector2 } from "../math";

export const P2BAdapter = ( poly: Polygon ) : Box => {
    let minX = Math.min.apply(
        Math, 
        ( !!poly.transform ) ? 
            poly.vertices.map( (pt: Vertex) => (<Konva.Transform>poly.transform).point( toPoint(pt) as Konva.Vector2d ).x  )
                :
            poly.vertices.map( (pt: Vertex) => pt[0] )      
    )

    let maxX = Math.max.apply(
        Math, 
        ( !!poly.transform ) ? 
            poly.vertices.map( (pt: Vertex) => (<Konva.Transform>poly.transform).point( toPoint(pt) as Konva.Vector2d ).x  )
                :
            poly.vertices.map( (pt: Vertex) => pt[0] )      
    )

    let minY = Math.min.apply(
        Math, 
        ( !!poly.transform ) ? 
            poly.vertices.map( (pt: Vertex) => (<Konva.Transform>poly.transform).point( toPoint(pt) as Konva.Vector2d ).y  )
                :
            poly.vertices.map( (pt: Vertex) => pt[1] )      
    )

    let maxY = Math.max.apply(
        Math, 
        ( !!poly.transform ) ? 
            poly.vertices.map( (pt: Vertex) => (<Konva.Transform>poly.transform).point( toPoint(pt) as Konva.Vector2d ).y  )
                :
            poly.vertices.map( (pt: Vertex) => pt[1] )      
    )

    return new Box(new Vector2(minX, minY), maxX-minX, maxY-minY);
} 