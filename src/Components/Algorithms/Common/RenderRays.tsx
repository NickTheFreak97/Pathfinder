import React from "react";
import { Line, Arrow } from "react-konva";
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
    
    const pt: Point_t[] | null | false = 
        (!!startPoint && !!destinationPoint) &&
            raycast(startPoint.coordinates, obstacles, destinationPoint.coordinates )
        

    const visibilityMap: VisibilityMap = getVisibilityMap( polygons, startPoint, destinationPoint );
    console.log( visibilityMap );

    if( !startPoint || !destinationPoint )
        return null;
    else
        return <React.Fragment>
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
                (!!startPoint && !!destinationPoint) && 
                <Line 
                    points={[startPoint.coordinates.x!, startPoint.coordinates.y!, destinationPoint.coordinates.x!, destinationPoint.coordinates.y!]}
                    strokeWidth={1}
                    fill="#FF9933"
                    stroke="#FF9933"
                    lineCap="round"
                    lineJoin="round"
                    />
            }
        </React.Fragment>
}

export default connect(mapStateToProps)(RenderRays);