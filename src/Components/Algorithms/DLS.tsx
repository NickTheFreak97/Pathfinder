import { store } from "../Redux/Store/store";
import { setExplored } from "../UseCases/SetDataStructures/setExplored";
import { setFrontier } from "../UseCases/SetDataStructures/setFrontier";
import { makeNode } from "./Common/Problem/Types/Node";

import { Action } from "./Common/Problem/Types/Action";
import { Problem } from "./Common/Problem/Types/Problem";
import { Node } from "./Common/Problem/Types/Node";
import { Analytics, autoComputeAnalytics, makeEmptyAnalytics } from "./Common/Problem/Types/Analytics";
import { makeSolutionAndLog, SolutionAndLog } from "./Common/Problem/Types/ResultAndLog";
import { LIFOFrontier } from "./Common/Problem/Structures/LIFOFrontier";

/**
 *  @returns [ Action[] ]: the sequence of actions if a solution is found
 *           [ null ]: if no solution is found
 *           [ false ]: if cutoff happened
 */
export const DLS = (problem: Problem, limit: number, computeEBF?: boolean): SolutionAndLog | null | false => {
    const rootNode: Node = {
        state: problem.initialState,
        parent: null, 
        action: [problem.initialState.value[1][0], problem.initialState.value[1][1]],
        cost: 0,
    }
    
    store.dispatch( setExplored({}) );
    store.dispatch( setFrontier(new LIFOFrontier()) );
    const analytics: Analytics = makeEmptyAnalytics("ID");
    analytics.generatedNodes = 1;

    const solution: Action[] | null | false = recursiveDLS( rootNode, problem, limit, analytics );

    if( !!solution ) {
        autoComputeAnalytics(analytics, !!solution ? solution.length : -1, !!computeEBF);
        return makeSolutionAndLog(solution, analytics);
    }
    else
        return solution;
}

function recursiveDLS( node: Node, problem: Problem, limit: number, analytics: Analytics | undefined ) : Action[] | null | false {

    if( problem.goalTest( node.state ) ) {

        const solution: Action[] = [];
        let theNode: Node | null | undefined = node;
        if( !!analytics ) {
            analytics.solutionDepth = 0;
            analytics.cost = node.cost;
        }

        while( !!theNode ) {
            solution.splice( 0, 0, theNode.action );
            theNode = theNode.parent;
            if( !!analytics )
                analytics.solutionDepth++;
        }

        return solution;
    } else
        if( limit === 0 )
            return false;
        else {
            let cutoff: boolean = false;
            let result: Action[] | false | null = null; 
            const availableActions = problem.actions( node.state );
            if( !!analytics )
                analytics.generatedNodes++;

            for( let i=0; i < availableActions.length; i++ ) {
                let vertex: Action = availableActions[i];
                const nextNode = makeNode( problem, node, vertex );
                result = recursiveDLS( nextNode, problem, limit-1, analytics );
                
                if( !result )
                    cutoff = true;
                else
                    if( !!result )
                        return result;
            }

            if( cutoff )
                return false;
            else 
                return null;
        }
}
