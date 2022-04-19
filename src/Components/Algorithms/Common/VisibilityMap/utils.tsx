import _ from "lodash";
import { Polygon } from "../../../GUIElements/Types/Shapes/Polygon";
import { Segment } from "../../../UseCases/InputPolygon/Common/Geometry";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";

export const polygonsToObstacleSegments = ( polygons: Polygon[] ): Segment[] => {
    return _.flatten(
        polygons.map( (polygon: Polygon, p: number): Segment[] => polygon.transformedVertices.map(
            (vertex: Vertex, i: number) =>  [vertex, polygons[p].transformedVertices[(i+1)% polygons[p].transformedVertices.length ]]
        ) )
    )
}

export const polygonsToAllVertices = ( polygons: Polygon[] ) : Vertex[] => {
    return _.flatten(
        polygons.map( (polygon: Polygon): Vertex[] => polygon.transformedVertices )
    );
}