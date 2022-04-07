import { MinPQFrontier } from "./Common/Problem/Structures/MinPQFrontier";
import { store } from "../Redux/Store/store";
import { setFrontier } from "../UseCases/SetDataStructures/setFrontier";
import { makeNode } from "./Common/Problem/Types/Node";
import { pushToExplored, pushToFrontier } from "./Common/Problem/Types/Problem";
import { popFrontier } from "./Common/Problem/Types/Problem";

import { Action } from "./Common/Problem/Types/Action";
import { State as ReduxState } from "../GUIElements/Types/Redux/State";
import { Problem } from "./Common/Problem/Types/Problem";
import { Node } from "./Common/Problem/Types/Node";
import { toString } from "./Common/Problem/Types/State";

const _UniformCost = ( problem: Problem ): Action[] | null => {
    const dispatch = store.dispatch;
    const state: () => ReduxState = store.getState;

    dispatch( setFrontier(new MinPQFrontier( (node: Node) => node.cost || 0 ) ) );
    const initialNode: Node = {
        state: problem.initialState,
        parent: null, 
        action: [problem.initialState.value[1][0], problem.initialState.value[1][1]],
        cost: 0,
    }
    dispatch( pushToFrontier(initialNode) );

    while( !state().frontier?.isEmpty() ) {
        const poppedNode: Node = dispatch( popFrontier() );

        if( problem.goalTest( poppedNode.state ) ) {

            const theSolution: Action[] = [];
            let prevNode: Node | null | undefined = poppedNode;
            while( !!prevNode ) {
                theSolution.splice(0, 0, prevNode.action);
                prevNode = prevNode.parent;
            }
            return theSolution;

        } else {

            dispatch( pushToExplored( toString(poppedNode.state) ) );
            problem.actions( poppedNode.state ).forEach(
                (action: Action)=>{
                    const nextNode: Node | null | undefined = makeNode(problem, poppedNode, action);
                    if( !state().explored![ toString( nextNode.state ) ] && !(state().frontier as MinPQFrontier)?.containsState( nextNode.state ) )
                        dispatch( pushToFrontier( nextNode ) );
                    else
                        if( ( state().frontier as MinPQFrontier )?.containsState( nextNode.state ) )
                            ( state().frontier as MinPQFrontier ).replaceIfBetter( nextNode );
                }
            )

        }
    }

    return null;
}

export const UniformCost = ( problem: Problem ) => {
    return new Promise<Action[] | null>( (resolve, reject)=>{
        const solution: Action[] | null = _UniformCost(problem);
        if( solution )
            resolve(solution);
        else
            reject(solution);
    } )
}