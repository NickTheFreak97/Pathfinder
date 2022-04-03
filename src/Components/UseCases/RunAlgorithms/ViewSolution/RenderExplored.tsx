import React from 'react';
import { Arrow } from 'react-konva';
import { connect } from 'react-redux';
import { Explored } from '../../../Algorithms/Common/Problem/Types/Problem';
import { State } from '../../../GUIElements/Types/Redux/State';
import { RunningOptions } from '../Types/RunningOptions';

const mapStateToProps = (state: State) => {
    return {
        explored: state.explored,
        options: state.options,
    }
}

interface RenderExploredProps {
    explored: Explored | null | undefined,
    options: RunningOptions,
}

const RenderExplored: React.FC<RenderExploredProps> = ({ explored, options }) => {
    return <React.Fragment>
        {
            ( !!explored && options.verbose ) &&
            Object.keys( explored ).map(
                (stateID: string) =>{

                    const pt: number[] = 
                                stateID.replaceAll('(', '')
                                    .replaceAll(')', '')
                                    .replace(/[\->\s]+/g, ',')
                                    .split(',')
                                    .map( (coordinate: string) : number => parseFloat(coordinate) )

                    return <Arrow points={pt}
                            fill="rgba(0,128,128, .15)"
                            stroke="rgba(0,128,128, .15)"
                            strokeWidth={1}
                            tension={1}
                            lineCap="round"
                            lineJoin="round"
                            pointerWidth={10}
                            key={stateID}
                    />
                }
            )
        }
    </React.Fragment>
}

export default connect(mapStateToProps)(RenderExplored);