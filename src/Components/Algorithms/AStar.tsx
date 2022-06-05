import { _UniformCost } from "./UniformCost";
import { store } from "../Redux/Store/store";

import { Problem } from "./Common/Problem/Types/Problem";
import { Action } from "./Common/Problem/Types/Action";
import { PointInfo } from "../GUIElements/Types/Shapes/PointInfo";
import { Node } from "./Common/Problem/Types/Node";
import { Analytics, autoComputeAnalytics, makeEmptyAnalytics } from "./Common/Problem/Types/Analytics";
import { makeSolutionAndLog, SolutionAndLog } from "./Common/Problem/Types/ResultAndLog";

export const AStar = ( problem: Problem, computeEBF?: boolean, p?: number ) => {
    return new Promise<SolutionAndLog | null>( (resolve, reject)=>{
        const destPoint: PointInfo = store.getState().destinationPoint!;
        const log: Analytics = makeEmptyAnalytics(`A*-d${p || 2}`);
        const pDist = p || 2;

        const result: Action[] | null = _UniformCost(
            problem,
            ( node: Node ) => 
                node.cost + 
                Math.pow( 
                    Math.abs(  Math.pow(
                        (node.action[0]-destPoint.coordinates.x!), 
                        pDist
                    )) 
                        + 
                    Math.abs( Math.pow( 
                        (node.action[1]-destPoint.coordinates.y!),
                        pDist
                        )), 
        
                    1/pDist),
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