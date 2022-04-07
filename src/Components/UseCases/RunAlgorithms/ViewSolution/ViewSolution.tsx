import React from "react";
import { Arrow } from 'react-konva';
import { connect } from "react-redux";
import { extractID } from "../../../Algorithms/Common/VisibilityMap/VisibilityMap";
import { Action } from "../../../Algorithms/Common/Problem/Types/Action";
import { State } from "../../../GUIElements/Types/Redux/State";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { PointInfo } from "../../../GUIElements/Types/Shapes/PointInfo";
import { RunningOptions } from "../Types/RunningOptions";

const mapStateToProps = (state: State) => {
    return {
        solution: state.solution,
        startPoint: state.startPoint,
        destinationPoint: state.destinationPoint,
        options: state.options,
    }
}

interface ViewSolutionProps {
    solution: Action[] | null | undefined,
    startPoint: PointInfo | null | undefined,
    destinationPoint: PointInfo | null | undefined,
    options: RunningOptions,
}

const ViewSolution : React.FC<ViewSolutionProps> = ({ solution, startPoint, destinationPoint, options }) => {
    if( !solution || !destinationPoint || !startPoint || !options.verbose.show.solution )
        return null;
    else
        return (
            <React.Fragment>
                {
                    solution.map(
                        (point: Vertex, i) => {
                            if( i === solution.length-1 )
                                return null;
                            else 
                                return (
                                    <Arrow points={ [ point[0], point[1], solution[i+1][0], solution[i+1][1] ] }
                                        fill={`rgb(203, 36, 49, ${options.verbose.opacity.solution/100})`}
                                        stroke={`rgb(203, 36, 49, ${options.verbose.opacity.solution/100})`}
                                        strokeWidth={2}
                                        tension={1}
                                        lineCap="round"
                                        lineJoin="round"
                                        pointerWidth={10}
                                        key={`${extractID( [point[0], point[1]] )}->${extractID([ solution[i+1][0], solution[i+1][1] ])}`}
                                    />
                                )
                        } 
                    )
                }
            </React.Fragment>
        )
}

export default connect(mapStateToProps)(ViewSolution);