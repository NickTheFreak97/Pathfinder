import { LIFOFrontier } from "./Common/Problem/Structures/LIFOFrontier";
import { store } from "../Redux/Store/store";
import { setFrontier } from "../UseCases/SetDataStructures/setFrontier";
import { setExplored } from "../UseCases/SetDataStructures/setExplored";
import { makeNode } from "./Common/Problem/Types/Node";
import { pushToExplored, pushToFrontier } from "./Common/Problem/Types/Problem";
import { popFrontier } from "./Common/Problem/Types/Problem";

import { Action } from "./Common/Problem/Types/Action";
import { Problem } from "./Common/Problem/Types/Problem";
import { State } from "../GUIElements/Types/Redux/State";
import { Node } from "./Common/Problem/Types/Node";
import { toString } from "./Common/Problem/Types/State";
import { Analytics, autoComputeAnalytics, makeEmptyAnalytics } from "./Common/Problem/Types/Analytics";
import { makeSolutionAndLog, SolutionAndLog } from "./Common/Problem/Types/ResultAndLog";

const _DFS = ( problem: Problem, analytics: Analytics | undefined ) : Action[] | undefined => {
    const dispatch = store.dispatch;
    const state: ()=> State = store.getState;

    dispatch( setFrontier( new LIFOFrontier( ) ) );
    dispatch( setExplored( {} ) );

    store.dispatch( pushToFrontier( {
        state: problem.initialState,
        parent: null, 
        action: [problem.initialState.value[1][0], problem.initialState.value[1][1]],
        cost: 0,
    } ) );

    if( !!analytics )
        analytics.generatedNodes = 1;

    while( !state().frontier?.isEmpty() ) {
        const poppedNode: Node = dispatch(popFrontier());
        dispatch( pushToExplored( toString( poppedNode.state ) ) );

        const foundSolution: Action[] = [];
        if( problem.goalTest( poppedNode.state ) ) {

            if( !!analytics ) {
                analytics.solutionDepth = 0;
                analytics.cost = poppedNode.cost;
            }

            let theNode: Node | null | undefined = poppedNode;
            while( !!theNode ) {
                foundSolution.splice(0, 0, theNode.action );
                theNode = theNode.parent;
                if( !!analytics )
                    analytics.solutionDepth++;
            }

            return foundSolution;
        } else {
            problem.actions( poppedNode.state ).forEach(
                (action: Action)=>{
                    const nextNode = makeNode(problem, poppedNode, action);
                    if( state().explored![ toString( nextNode.state ) ] === undefined &&
                        !state().frontier!.contains( nextNode ) ) {
                            dispatch( pushToFrontier( nextNode ) );
                            if( !!analytics )
                                analytics.generatedNodes++;
                        }
                }
            )
        }

    }

    return;
}

export const DFS = ( problem: Problem, computeEBF?: boolean ) => {
    return new Promise<SolutionAndLog | undefined>((resolve, reject) => {
        const analytics: Analytics = makeEmptyAnalytics("DFS");
        const solution = _DFS(problem, analytics);

        autoComputeAnalytics(analytics, solution?.length || -1, !!computeEBF);

        if( !!solution ) 
            resolve(makeSolutionAndLog(solution, analytics));
        else    
            reject(undefined);
    } )
}