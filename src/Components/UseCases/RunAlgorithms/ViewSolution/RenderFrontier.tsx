import React from 'react';
import { Arrow } from 'react-konva';
import { connect } from 'react-redux';
import { extractID } from '../../../Algorithms/Common/VisibilityMap/VisibilityMap';

import { State } from '../../../GUIElements/Types/Redux/State';
import { Frontier } from '../../../Algorithms/Common/Problem/Types/Problem';
import { RunningOptions } from '../Types/RunningOptions';
import { Node } from '../../../Algorithms/Common/Problem/Types/Node';

const mapStateToProps = (state: State) => {
    return {
        frontier: state.frontier,
        options: state.options,
    }
}

interface RenderFrontierProps {
    frontier: Frontier | null | undefined,
    options: RunningOptions,
}

const RenderFrontierProps: React.FC<RenderFrontierProps> = ({ frontier, options }) => {
    return (
        <React.Fragment>
            {(options.verbose && !!frontier) &&
                frontier.queue.map(
                    ( n: Node, index: number, _: Node[] ) => 
                    !!n.parent &&
                        <Arrow 
                            points={
                                [ n.parent.action[0], n.parent.action[1], n.action[0], n.action[1] ]
                            }
                            strokeWidth={1}
                            fill="rgba(0,0,255, .3)"
                            stroke="rgba(0,0,255, .3)"
                            lineCap="round"
                            lineJoin="round"
                            key={`${extractID(n.parent.action!)}->${extractID(n.action)}`}
                        />
                )
            }
        </React.Fragment>
    );
}

export default connect(mapStateToProps)(RenderFrontierProps);