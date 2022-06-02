import React from 'react';
import Konva from "konva";
import { connect } from 'react-redux';
import Point from '../../GUIElements/Shapes/Point';
import { extractID } from '../../Algorithms/Common/VisibilityMap/VisibilityMap';
import { toPoint } from '../../GUIElements/Types/Shapes/PolygonGUIProps';

import { Circle } from 'react-konva';
import { State } from '../../GUIElements/Types/Redux/State';
import { RandomPolyCircleItem } from './addRandonPolygonCircle';
import { Polygon } from '../../GUIElements/Types/Shapes/Polygon';
import { toVertex } from '../../GUIElements/Types/Shapes/Point';

const mapStateToProps = (state: State) => {
    return {
        randomCircles: state.randomPolyCircles, 
        polygons: state.polygons,
        visible: state.options.verbose.show.randomPolygonCircles,
        opacity: state.options.verbose.opacity.randomPolygonCircles
    }
}

interface RenderSamplesProps {
    randomCircles?: RandomPolyCircleItem[],
    polygons?: Polygon[],
    visible?: boolean,
    opacity?: number,
}

const RenderSamples : React.FC<RenderSamplesProps> = ({randomCircles, polygons, visible, opacity}) => {

    return <>
        {
            (randomCircles && visible) && 
            Object.values(randomCircles).map(
                circle => {

                    const thisPoly: Polygon | undefined = polygons!.find(
                        (p: Polygon) => p.id === circle.id
                    )!;

                    const circumCenterTr =
                        thisPoly?.transform?.point(
                            toPoint(
                                circle.circumCenter
                            ) as Konva.Vector2d,
                        )
                    
                    const circumCenterCoord = 
                        circumCenterTr ? 
                            toVertex(circumCenterTr)
                                :
                            circle.circumCenter
                    
                    return (
                        <React.Fragment key={extractID(circumCenterCoord)}>
                            <Circle
                                x={circumCenterCoord[0]}
                                y={circumCenterCoord[1]}
                                radius={circle.outerRadius}
                                strokeWidth={1}
                                stroke={`rgba(0,0,0,${0.2*opacity!/100})`}
                            />

                            <Circle
                                x={circumCenterCoord[0]}
                                y={circumCenterCoord[1]}
                                radius={circle.innerRadius}
                                strokeWidth={1}
                                stroke={`rgba(221,107,32,${opacity!/100})`}
                            />

                            <Point
                                x={circumCenterCoord[0]}
                                y={circumCenterCoord[1]}
                                name={extractID(circumCenterCoord)}
                            />
                        </React.Fragment>
                    )
                }
            )
        }
    </>;
}

export default connect(mapStateToProps, null)(RenderSamples);