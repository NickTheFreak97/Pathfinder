import { Layer, Line, Arrow } from "react-konva";
import { connect } from 'react-redux';
import _ from "lodash";
import { v4 as uuidv4, validate } from "uuid";

import { raycast } from "./Raycasting";
import { getVisibilityMap, VisibilityMap, extractPoint, extractID } from "./VisibilityMap/VisibilityMap";
import Point from "../../GUIElements/Shapes/Point";
import { State } from "../../GUIElements/Types/Redux/State";
import { PointInfo } from "../../GUIElements/Types/Shapes/PointInfo";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { ThreeOrMoreVertices } from "../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Point as Point_t } from "../../GUIElements/Types/Shapes/Point";
import { Segment } from "../../UseCases/InputPolygon/Common/Geometry";
import { Vertex } from "../../GUIElements/Types/Shapes/PolygonGUIProps";

const mapStateToProps = (state: State) => {
    return {
        polygons: state.polygons,
        startPoint: state.startPoint,
        destinationPoint: state.destinationPoint,
        currentPoint: state.currentPoint,
    }
}

interface RenderRaysProps {
    polygons: Polygon[],
    startPoint: PointInfo | null | undefined,
    destinationPoint: PointInfo | null | undefined,
    currentPoint: Vertex | null | undefined,
}

const RenderRays: React.FC<RenderRaysProps> = ({polygons, startPoint, destinationPoint, currentPoint}) => {

    const obstacles: Segment[] = 
        _.flatten(
            polygons.map( (polygon: Polygon): ThreeOrMoreVertices => polygon.vertices )
            .map( (vertices: ThreeOrMoreVertices)  => 
                vertices.map( (vertex: Vertex, i): Segment => 
                    [[vertex[0], vertex[1]], vertices[(i+1) % vertices.length ]] 
                ) 
            )
        )
    
    const pt: Point_t[] | undefined | false = 
        (!!startPoint && !!currentPoint) &&
        (
            raycast(startPoint!.coordinates, obstacles, { x: currentPoint[0], y: currentPoint[1] } )
                ?.filter( (intersectionPt) => 
                    ( (intersectionPt.x !== startPoint.coordinates.x && 
                        intersectionPt.y !== startPoint.coordinates.y) &&
                        (intersectionPt.x !== currentPoint[0] && 
                            intersectionPt.y !== currentPoint[1]) ) 
                )
        );

    const visibilityMap: VisibilityMap = getVisibilityMap( polygons, startPoint, destinationPoint );
    console.log( visibilityMap );

    if( !startPoint || !destinationPoint )
        return null;
    else
        return <Layer>
            {
                !!pt &&
                pt.map(
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
                            key={`(${intersectionPt.x}, ${intersectionPt.y})`}
                        />
                )
            }
            {
                _.flatten(
                    Object.keys(visibilityMap).map( (pointID: string) => { 
                        const start: Vertex = !validate(pointID) ?
                            extractPoint(pointID) :
                                ( pointID === startPoint.id ) ?
                                    [ startPoint.coordinates.x!, startPoint.coordinates.y! ] 
                                        :
                                    [ destinationPoint.coordinates.x!, destinationPoint.coordinates.y! ]
                        
                        return visibilityMap[pointID].map( (endPoint: Vertex) => 
                            <Arrow points={ [ start[0], start[1], endPoint[0], endPoint[1] ] }
                                fill="#CCC"
                                stroke="rgba(97,97,97, 0.3)"
                                strokeWidth={1}
                                tension={1}
                                lineCap="round"
                                lineJoin="round"
                                pointerWidth={5}
                                key={`${extractID([start[0], start[1]])}->${extractID([endPoint[0], endPoint[1]])}`}
                            />  )
                    })
                )
            }
            {
                (!!startPoint && !!currentPoint) && 
                <Line 
                    points={[startPoint.coordinates.x!, startPoint.coordinates.y!, currentPoint![0], currentPoint![1]]}
                    strokeWidth={1}
                    fill="#FF9933"
                    stroke="#FF9933"
                    lineCap="round"
                    lineJoin="round"
                    />
            }
        </Layer>
}

export default connect(mapStateToProps)(RenderRays);