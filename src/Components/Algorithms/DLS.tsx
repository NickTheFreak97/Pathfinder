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

/**
 *  @returns [ Action[] ]: the sequence of actions if a solution is found
 *           [ null ]: if no solution is found
 *           [ false ]: if cutoff happened
 */
export const DLS = (problem: Problem, limit: number): Action[] | null | false => {
    const rootNode: Node = {
        state: problem.initialState,
        parent: null, 
        action: [problem.initialState.value[1][0], problem.initialState.value[1][1]],
        cost: 0,
    }
    
    store.dispatch( setExplored({}) );

    return recursiveDLS( rootNode, problem, limit );
}

function recursiveDLS( node: Node, problem: Problem, limit: number ) : Action[] | null | false {

    if( problem.goalTest( node.state ) ) {

        const solution: Action[] = [];
        let theNode: Node | null | undefined = node;

        while( !!theNode ) {
            solution.splice( 0, 0, theNode.action );
            theNode = theNode.parent;
        }

        return solution;
    } else
        if( limit === 0 )
            return false;
        else {
            let cutoff: boolean = false;
            let result: Action[] | false | null = null; 
            const availableActions = problem.actions( node.state );

            for( let i=0; i < availableActions.length; i++ ) {
                let vertex: Action = availableActions[i];
                const nextNode = makeNode( problem, node, vertex );
                result = recursiveDLS( nextNode, problem, limit-1 );
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
