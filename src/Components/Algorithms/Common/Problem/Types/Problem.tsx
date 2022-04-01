import { State } from "./State";
import { Vertex } from "../../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Action } from "./Action";
import { Action as ReduxAction } from "../../../../GUIElements/Types/Redux/Action";
import { Node } from "./Node";
import { POP_FRONTIER, PUSH_EXPLORED, PUSH_FRONTIER } from "../../../../Redux/Actions/ActionTypes";
import { Dispatch } from "react";
import { State as ReduxState } from "../../../../GUIElements/Types/Redux/State";

export interface Problem {
    initialState: State,
    actions: (state: State) => Action[],
    result: (state: State, vertex: Vertex) => State,
    cost: (s: State, a: Action) => number,
    goalTest: (state: State) => boolean,
}

/** To be extended as FIFOFrontier, LIFOFrontier, PQFrontier */
export interface Frontier {
    queue: Array<Node>,
    contains: (node: Node) => boolean,
    getFirst: () => Node | undefined,
    isEmpty: () => boolean,
    push: ( node: Node ) => Array<Node>,
    clear: () => void,
}

export interface Explored {
    [key: string] : boolean
}

export const pushToFrontier = (node: Node) => ( dispatch: Dispatch<ReduxAction>, getState: () => ReduxState ) => {
    const oldFrontier: Frontier | null | undefined = getState().frontier;
    dispatch(
        {
            type: PUSH_FRONTIER, 
    
            payload: {
                frontier: !!oldFrontier ? { ...oldFrontier, queue: [...oldFrontier.push(node)] }: oldFrontier,
            }
        }
    )
}

const _popFrontier = ( frontier: Frontier ): ReduxAction => {
    return {
        type: POP_FRONTIER, 

        payload: {
            frontier
        }
    }
}

export const popFrontier = () => ( dispatch: Dispatch<ReduxAction>, getState: ()=> ReduxState ) => {
        const frontier = getState().frontier;
    
        if( !frontier )
            return frontier;
        else {
            const poppedNode: Node | null | undefined = frontier.getFirst();
            if( poppedNode === null || poppedNode === undefined )
                return;
            else {
                dispatch( _popFrontier( frontier ) );
                return poppedNode;
            }
        }
}

export const pushToExplored = ( stateID: string ) => (dispatch: Dispatch<ReduxAction>, getState: ()=> ReduxState) => {
    dispatch({
        type: PUSH_EXPLORED, 

        payload: {
            stateID
        }
    })
}