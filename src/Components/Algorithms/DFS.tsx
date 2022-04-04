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

const _DFS = ( problem: Problem ) : Action[] | undefined => {
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

    while( !state().frontier?.isEmpty() ) {
        const poppedNode: Node = dispatch(popFrontier());
        dispatch( pushToExplored( toString( poppedNode.state ) ) );

        const foundSolution: Action[] = [];
        if( problem.goalTest( poppedNode.state ) ) {

            let theNode: Node | null | undefined = poppedNode;
            while( !!theNode ) {
                foundSolution.splice(0, 0, theNode.action );
                theNode = theNode.parent;
            }

            return foundSolution;
        } else {
            problem.actions( poppedNode.state ).forEach(
                (action: Action)=>{
                    const nextNode = makeNode(problem, poppedNode, action);
                    if( state().explored![ toString( nextNode.state ) ] === undefined &&
                        !state().frontier!.contains( nextNode ) )
                            dispatch( pushToFrontier( nextNode ) );

                }
            )
        }

    }

    return;
}

export const DFS = ( problem: Problem ) => {
    return new Promise<Action[] | undefined>((resolve, reject) => {
        const solution = _DFS(problem);
        if( !!solution ) 
            resolve(solution);
        else    
            reject(undefined);
    } )
}