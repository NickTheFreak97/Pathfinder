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
import { Analytics, makeEmptyAnalytics } from "./Common/Problem/Types/Analytics";
import { makeSolutionAndLog, SolutionAndLog } from "./Common/Problem/Types/ResultAndLog";

const _BFS = ( problem: Problem, analytics: Analytics | undefined ) : Action[] | undefined => {
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

    if( !!analytics )
        analytics.generatedNodes = 0;

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

                        if( problem.goalTest( nextNode.state ) ) {
    
                            if( !!analytics )
                                analytics.solutionDepth = 0;
                            const solution: Action[] = [];
                            let theNode: Node | null | undefined = nextNode;
                            while( theNode !== null ) {
                                solution.splice( 0, 0, theNode!.action );
                                theNode = theNode!.parent;
                                if( !!analytics )
                                    analytics.solutionDepth++;
                            }
                            
                            foundSolution = solution;
                        } else {
                            if( !!analytics )
                                analytics.generatedNodes++;
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
    return new Promise<SolutionAndLog | undefined>((resolve, reject) => {
        const analytics = makeEmptyAnalytics();
        const solution = _BFS(problem, analytics);
        if( !!solution ) 
            resolve(makeSolutionAndLog(solution, analytics));
        else    
            reject(undefined);
    } )
}