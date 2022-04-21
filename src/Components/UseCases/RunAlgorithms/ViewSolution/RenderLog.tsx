import React from "react";
import { Text } from "react-konva";
import { connect } from "react-redux";
import { findRoot } from "../../../Algorithms/Common/Analytics/Utils/Newton";

import { Analytics } from "../../../Algorithms/Common/Problem/Types/Analytics";
import { State } from "../../../GUIElements/Types/Redux/State";

interface RenderLogProps {
    stageHeight: number,
    stageWidth: number, 
    log: Analytics
}

const mapStateToProps = (state: State) => {
    return {
        log: state.solutionAnalytics,
    }
}

const RenderLogs: React.FC< RenderLogProps > = ({stageHeight, stageWidth, log}) => {
    return <React.Fragment>
        {   !!log &&
            <Text
                width={stageWidth}
                height={stageHeight}
                text={ ((log.branchingFactor >= 1) ? `Effective Branching Factor: ${findRoot(log.solutionDepth, log.generatedNodes).toString()}\n` : ``) +
                        `Memory usage: ${log.memory} Bytes
                        Completion time: ${log.completionTime/1000} sec`}
                x={0}
                y={0}
                fontSize={16}
                fontFamily={"Calibri"}
                align={"right"}
                verticalAlign={"bottom"}
                fill={"black"}
                listening={false}
                perfectDrawEnabled={false}
                transformsEnabled="position"
                shadowEnabled={false}
                shadowForStrokeEnabled={false}
            />
        } 
    </React.Fragment>
}

export default connect(mapStateToProps)(RenderLogs);