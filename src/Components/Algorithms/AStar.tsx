import { _UniformCost } from "./UniformCost";
import { store } from "../Redux/Store/store";

import { Problem } from "./Common/Problem/Types/Problem";
import { Action } from "./Common/Problem/Types/Action";
import { PointInfo } from "../GUIElements/Types/Shapes/PointInfo";
import { Node } from "./Common/Problem/Types/Node";
import { Analytics, autoComputeAnalytics, makeEmptyAnalytics } from "./Common/Problem/Types/Analytics";
import { makeSolutionAndLog, SolutionAndLog } from "./Common/Problem/Types/ResultAndLog";

export const AStar = ( problem: Problem, computeEBF?: boolean ) => {
    return new Promise<SolutionAndLog | null>( (resolve, reject)=>{
        const destPoint: PointInfo = store.getState().destinationPoint!;
        const log: Analytics | undefined = !!computeEBF ? makeEmptyAnalytics("A*") : undefined;

        const result: Action[] | null = _UniformCost(
            problem,
            ( node: Node ) => 
                node.cost + 
                Math.sqrt(( (node.action[0]-destPoint.coordinates.x! )*(node.action[0]-destPoint.coordinates.x! ) +
                  (node.action[1]-destPoint.coordinates.y! )*(node.action[1]-destPoint.coordinates.y! ) )), 
                log
        )

        if( !!log )
            autoComputeAnalytics(log, result?.length || -1, !!computeEBF);

        if( !!result )
            resolve(makeSolutionAndLog(result, log));
        else
            reject(makeSolutionAndLog(result, log));
    } ); 
}