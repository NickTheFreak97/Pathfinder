import { Layer, Line } from "react-konva";
import { connect } from 'react-redux';
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

import Point from "../../GUIElements/Shapes/Point";
import { State } from "../../GUIElements/Types/Redux/State";
import { PointInfo } from "../../GUIElements/Types/Shapes/PointInfo";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { ThreeOrMoreVertices } from "../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Point as Point_t } from "../../GUIElements/Types/Shapes/Point";
import { Segment } from "../../UseCases/InputPolygon/Common/Geometry";
import { Vertex } from "../../GUIElements/Types/Shapes/PolygonGUIProps";
import { raycast } from "./Raycasting";

const mapStateToProps = (state: State) => {
    return {
        polygons: state.polygons,
        startPoint: state.startPoint,
        destinationPoint: state.destinationPoint,
    }
}

interface RenderRaysProps {
    polygons: Polygon[],
    startPoint: PointInfo | null | undefined,
    destinationPoint: PointInfo | null | undefined,
}

const RenderRays: React.FC<RenderRaysProps> = ({polygons, startPoint, destinationPoint}) => {
    const obstacles: Segment[] = 
        _.flatten(
            polygons.map( (polygon: Polygon): ThreeOrMoreVertices => polygon.vertices )
            .map( (vertices: ThreeOrMoreVertices)  => 
                vertices.map( (vertex: Vertex, i): Segment => 
                    [[vertex[0], vertex[1]], vertices[(i+1) % vertices.length ]] 
                ) 
            )
        )

    if( !startPoint || !destinationPoint )
        return null;
    else
        return <Layer>
            {
                raycast(startPoint.coordinates, obstacles, destinationPoint.coordinates )?.map(
                    (intersectionPt: Point_t ) => 
                        ( (intersectionPt.x !== startPoint.coordinates.x && 
                            intersectionPt.y !== startPoint.coordinates.y) &&
                            (intersectionPt.x !== destinationPoint.coordinates.x && 
                                intersectionPt.y !== destinationPoint.coordinates.y) ) && 
                        <Point
                            x={intersectionPt.x!}
                            y={intersectionPt.y!}
                            innerFill="#FF9933"
                            outerFill="rgba(255,153,51,0.25)"
                            name={uuidv4()}
                        />
                )
            }
            <Line 
                points={[startPoint.coordinates.x!, startPoint.coordinates.y!, destinationPoint.coordinates.x!, destinationPoint.coordinates.y!]}
                strokeWidth={1}
                fill="#FF9933"
                stroke="#FF9933"
                lineCap="round"
                lineJoin="round"
                />
        </Layer>
}

export default connect(mapStateToProps)(RenderRays);