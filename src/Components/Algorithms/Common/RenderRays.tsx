import Konva from "konva";
import React from "react";
import { Line, Arrow } from "react-konva";
import { connect } from 'react-redux';
import _ from "lodash";
import { v4 as uuidv4, validate } from "uuid";

import { raycast } from "./Raycasting";
import { VisibilityMap, extractPoint, extractID } from "./VisibilityMap/VisibilityMap";
import Point from "../../GUIElements/Shapes/Point";
import { State } from "../../GUIElements/Types/Redux/State";
import { PointInfo } from "../../GUIElements/Types/Shapes/PointInfo";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { Point as Point_t, toVertex } from "../../GUIElements/Types/Shapes/Point";
import { Segment } from "../../UseCases/InputPolygon/Common/Geometry";
import { Vertex } from "../../GUIElements/Types/Shapes/PolygonGUIProps";
import { RunningOptions } from "../../UseCases/RunAlgorithms/Types/RunningOptions";

import { polygonsToObstacleSegments } from "./VisibilityMap/utils";

const mapStateToProps = (state: State) => {
    return {
        polygons: state.polygons,
        startPoint: state.startPoint,
        destinationPoint: state.destinationPoint,
        options: state.options,
        visibilityMap: state.visibilityMap,
        currentPoint: state.currentPoint,
    }
}

interface RenderRaysProps {
    polygons: Polygon[],
    startPoint: PointInfo | null | undefined,
    destinationPoint: PointInfo | null | undefined,
    options: RunningOptions,
    visibilityMap: VisibilityMap | null | undefined,
    currentPoint: Vertex | null | undefined,
}

const RenderRays: React.FC<RenderRaysProps> = ({polygons, startPoint, destinationPoint, options, visibilityMap}) => {

    const obstacles: Segment[] = 
        polygonsToObstacleSegments(polygons);
    
    const pt: Point_t[] | null | false = 
        (!!startPoint && !!destinationPoint) &&
            raycast(startPoint.coordinates, obstacles, destinationPoint.coordinates )
        

    if( !startPoint || !destinationPoint || !visibilityMap || !options.verbose.show.visibility)
        return null;
    else
        return <React.Fragment>
            {
                !!pt &&
                pt.map(
                    (intersectionPt: Point_t ) => 
                    (
                        extractID(toVertex(intersectionPt)) !== extractID( toVertex(startPoint.coordinates) ) &&
                        extractID(toVertex(intersectionPt)) !== extractID( toVertex(destinationPoint.coordinates) ) 
                    )  && 
                        <Point
                            x={intersectionPt.x!}
                            y={intersectionPt.y!}
                            innerFill={`rgb(255, 153, 51, ${options.verbose.opacity.visibility/100})`}
                            outerFill={`rgba(255, 153, 51, ${options.verbose.opacity.visibility*0.25/100} )`}
                            name={uuidv4()}
                            key={`(${intersectionPt.x}, ${intersectionPt.y})`}
                        />
                )
            }

            {
                _.flatten(
                    Object.keys(visibilityMap!).map( (pointID: string) => { 
                        const start: Vertex = !validate(pointID) ?
                            extractPoint(pointID) :
                                ( pointID === startPoint.id ) ?
                                    [ startPoint.coordinates.x!, startPoint.coordinates.y! ] 
                                        :
                                    [ destinationPoint.coordinates.x!, destinationPoint.coordinates.y! ]
                        
                        return visibilityMap![pointID].map( (endPoint: Vertex) => 
                            <Arrow points={ [ start[0], start[1], endPoint[0], endPoint[1] ] }
                                fill={`rgb(204, 204, 204, ${options.verbose.opacity.visibility/100})`}
                                stroke={`rgba(97,97,97, ${options.verbose.opacity.visibility*0.3/100})`}
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
                    fill={`rgb(255, 153, 51, ${options.verbose.opacity.visibility/100})`}
                    stroke={`rgb(255, 153, 51, ${options.verbose.opacity.visibility/100})`}
                    lineCap="round"
                    lineJoin="round"
                    />
            }
        </React.Fragment>
}

export default connect(mapStateToProps)(RenderRays);