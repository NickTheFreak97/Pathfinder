import _ from "lodash";
import { Polygon } from "../../../GUIElements/Types/Shapes/Polygon";
import { Segment } from "../../../UseCases/InputPolygon/Common/Geometry";
import { ThreeOrMoreVertices } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";

export const polygonsToObstacleSegments = ( polygons: Polygon[] ): Segment[] => {
    return _.flatten(
        polygons.map( (polygon: Polygon): ThreeOrMoreVertices => polygon.vertices )
        .map( (vertices: ThreeOrMoreVertices)  => 
            vertices.map( (vertex: Vertex, i): Segment => 
                [[vertex[0], vertex[1]], vertices[(i+1) % vertices.length ]] 
            ) 
        )
    )
}

export const polygonsToAllVertices = ( polygons: Polygon[] ) : Vertex[] => {
    return _.flatten(
        polygons.map( (polygon: Polygon): ThreeOrMoreVertices => polygon.vertices )
    );
}