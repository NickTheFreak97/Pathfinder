import React from "react";
import { Table, ActionIcon, Notification } from '@mantine/core';
import { connect } from "react-redux";
import { CopyIcon } from "@modulz/radix-icons";

import { Analytics } from "../../../Algorithms/Common/Problem/Types/Analytics";
import { State } from "../../../GUIElements/Types/Redux/State";

interface RenderLogProps {
    log: Analytics
}

const mapStateToProps = (state: State) => {
    return {
        log: state.solutionAnalytics,
    }
}

const RenderLogs: React.FC< RenderLogProps > = ({log}) => {
    const precision: number = 4;

    const logTxt = [
        log.algorithmName,
        log.polygonCount,
        log.maxVertices,
        log.avgVertices.toFixed(precision),
        log.branchingFactor,
        log.solutionDepth,
        log.cost.toFixed(precision),
        log.memory,
        log.completionTime,
        log.EBF?.toFixed(precision) || 'N.A',
        log.frontierSize,
        log.exploredSize,
    ]

    return <React.Fragment>
        {   (!!log && log.solutionDepth > 0) &&
            <Table>
                <thead>
                    <tr>
                    <th>Algorithm</th>
                    <th>Polygons</th>
                    <th>Max vertices</th>
                    <th>Avg vertices</th>
                    <th>b</th>
                    <th>Depth</th>
                    <th>Cost</th>
                    <th>Memory (B)</th>
                    <th>Time (ms)</th>
                    <th>EBF</th>
                    <th>Frontier #</th>
                    <th>Explored #</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {
                            logTxt.map(
                                txt => 
                                    <td>
                                        {txt}
                                    </td>
                            )
                        }
                        <td>
                            <ActionIcon size="lg" variant="light" color="blue"
                                onClick={
                                    ()=> navigator.clipboard.writeText(
                                        logTxt.join(',')
                                    )
                                }>
                                <CopyIcon />
                            </ActionIcon>
                        </td>
                    </tr>
                </tbody>
            </Table>
        } 

    </React.Fragment>
}

export default connect(mapStateToProps)(RenderLogs);