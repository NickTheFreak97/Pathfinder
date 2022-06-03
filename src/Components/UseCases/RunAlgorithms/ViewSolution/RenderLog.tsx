import React, {useState, useEffect} from "react";
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
    
    const [logNotificationVisible, setLogNotificationVisible] = useState<boolean>(false);

    useEffect(
        ()=>{
            if( logNotificationVisible )
                setTimeout(
                    ()=> setLogNotificationVisible(false),
                    3500
                )
        }, [logNotificationVisible]
    )

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
        (log.EBF && log.EBF > 0) ? log.EBF?.toFixed(precision) : 'N.A',
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
                                (txt, i) => 
                                    <td key={i} >
                                        {txt}
                                    </td>
                            )
                        }
                        <td>
                            <ActionIcon size="lg" variant="light" color="blue"
                                onClick={
                                    ()=> {
                                        navigator.clipboard.writeText(
                                            logTxt.join(',')
                                        )
                                        setLogNotificationVisible(true);
                                    }
                                }>
                                <CopyIcon />
                            </ActionIcon>
                        </td>
                    </tr>
                </tbody>
            </Table>
        } 
        <Notification title="Log copied" color={'grape'} onClose={() => setLogNotificationVisible(false)}
            style={{
                position: 'absolute', 
                bottom: 0, 
                left: '50%', 
                transform: 'translate(-25%, -50%)', 
                zIndex: 1, 
                maxWidth: '350px',
                display: logNotificationVisible ? 'flex':'none'
            }} >
            You copied the log of the algorithm's execution and paste it as CSV values 
        </Notification>

    </React.Fragment>
}

export default connect(mapStateToProps)(RenderLogs);