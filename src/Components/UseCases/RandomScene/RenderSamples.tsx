import React, {useState, useEffect} from 'react';
import { KDTree } from 'mnemonist';
import { connect } from 'react-redux';
import Point from '../../GUIElements/Shapes/Point';
import PoissonDiskSampling from 'poisson-disk-sampling';
import { extractID } from '../../Algorithms/Common/VisibilityMap/VisibilityMap';
import { extractPoint } from '../../Algorithms/Common/VisibilityMap/VisibilityMap';
import { Vertex } from '../../GUIElements/Types/Shapes/PolygonGUIProps';
import { Circle, Line, Rect } from 'react-konva';
import { State } from '../../GUIElements/Types/Redux/State';
import { RandomPolyCircleItem } from './addRandonPolygonCircle';
import { SceneRect } from './updateSceneRect';

const mapStateToProps = (state: State) => {
    return {
        randomCircles: state.randomPolyCircles, 
        scene: state.sceneRect,
    }
}

interface RenderSamplesProps {
    randomCircles?: RandomPolyCircleItem[],
    scene?: SceneRect,
}

const RenderSamples : React.FC<RenderSamplesProps> = ({randomCircles, scene}) => {

    return <>
        {
            randomCircles && 
            Object.values(randomCircles).map(
                circle => 
                    <React.Fragment key={extractID(circle.circumCenter)}>
                        {/* <Circle
                            x={circle.circumCenter[0]}
                            y={circle.circumCenter[1]}
                            radius={circle.outerRadius}
                            strokeWidth={1}
                            stroke={'rgba(0,0,0, .2)'}
                        />

                        <Circle
                            x={circle.circumCenter[0]}
                            y={circle.circumCenter[1]}
                            radius={circle.innerRadius}
                            strokeWidth={1}
                            stroke={'#FF0043'}
                        />
                        <Point
                            x={circle.circumCenter[0]}
                            y={circle.circumCenter[1]}
                            name={extractID(circle.circumCenter)}
                        /> */}
                    </React.Fragment>
            )
        }
    </>;
}

export default connect(mapStateToProps, null)(RenderSamples);