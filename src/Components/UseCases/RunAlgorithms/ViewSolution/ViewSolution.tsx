import React from "react";
import { Layer, Arrow } from 'react-konva';
import { connect } from "react-redux";
import { extractID } from "../../../Algorithms/Common/VisibilityMap/VisibilityMap";
import { Action } from "../../../Algorithms/Common/Problem/Types/Action";
import { State } from "../../../GUIElements/Types/Redux/State";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { PointInfo } from "../../../GUIElements/Types/Shapes/PointInfo";

const mapStateToProps = (state: State) => {
    return {
        solution: state.solution,
        startPoint: state.startPoint,
        destinationPoint: state.destinationPoint,
    }
}

interface ViewSolutionProps {
    solution: Action[] | null | undefined,
    startPoint: PointInfo | null | undefined,
    destinationPoint: PointInfo | null | undefined
}

const ViewSolution : React.FC<ViewSolutionProps> = ({ solution, startPoint, destinationPoint }) => {
    if( !solution || !destinationPoint || !startPoint )
        return null;
    else
        return (
            <Layer>
                {
                    solution.map(
                        (point: Vertex, i) => {
                            if( i === solution.length-1 )
                                return null;
                            else 
                                return (
                                    <Arrow points={ [ point[0], point[1], solution[i+1][0], solution[i+1][1] ] }
                                        fill="rgb(75, 172, 97)"
                                        stroke="rgb(75, 172, 97, 0.7)"
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
            </Layer>
        )
}

export default connect(mapStateToProps)(ViewSolution);