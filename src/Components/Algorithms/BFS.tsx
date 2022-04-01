import { Problem, pushToExplored } from "./Common/Problem/Types/Problem";
import { Action } from "./Common/Problem/Types/Action";
import { FIFOFrontier } from "./Common/Problem/Structures/FIFOFrontier";
import { Node, makeNode } from "./Common/Problem/Types/Node";
import { toString } from "./Common/Problem/Types/State";
import { Vertex } from "../GUIElements/Types/Shapes/PolygonGUIProps";
import { store } from "../Redux/Store/store";
import { setFrontier } from "../UseCases/SetDataStructures/setFrontier";
import { setExplored } from "../UseCases/SetDataStructures/setExplored";
import { pushToFrontier, popFrontier } from "./Common/Problem/Types/Problem";

const _BFS = ( problem: Problem ) : Action[] | undefined => {
    store.dispatch( setFrontier(new FIFOFrontier()) );
    store.dispatch( setExplored({}) );

    if( problem.goalTest(problem.initialState) )
        return [problem.initialState.value[0]];

    const initialNode: Node = {
            state: problem.initialState,
            parent: null, 
            action: [problem.initialState.value[1][0], problem.initialState.value[1][1]],
            cost: 0,
    }

    store.dispatch(
        pushToFrontier( initialNode )
    )

    while( store.getState().frontier!.queue.length > 0 ) {
            const poppedNode = store.dispatch(popFrontier()!)
            store.dispatch(pushToExplored(toString(poppedNode.state)))
            const visibleVertices: Action[] = problem.actions( poppedNode.state );

            let foundSolution: Action[] | undefined = undefined;
            visibleVertices.forEach(
                (vertex: Vertex) => {
                    const nextNode: Node = makeNode(problem, poppedNode, vertex);
    
                    if( typeof store.getState().explored![toString(nextNode.state)] === "undefined" 
                            && !store.getState().frontier!.contains(nextNode) ) {

                        if( problem.goalTest( poppedNode.state ) ) {
    
                            const solution: Action[] = [];
                            let theNode: Node | null | undefined = poppedNode;
                            while( theNode !== null ) {
                                solution.splice( 0, 0, theNode!.action );
                                theNode = theNode!.parent;
                            }
                            
                            foundSolution = solution;
                        } else {
                            store.dispatch(pushToFrontier( nextNode ));
                        }
                    } 
                }
            )

            if( !!foundSolution )
                return foundSolution;
        }
    
    return;
}

export const BFS = (problem: Problem) => {
    return new Promise<Action[] | undefined>((resolve, reject) => {
        const solution = _BFS(problem);
        if( !!solution ) 
            resolve(solution);
        else    
            reject(undefined);
    } )
}