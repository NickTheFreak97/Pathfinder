import { State, compareStates } from "./State";
import { Problem } from "./Problem";
import { Action, compareActions } from "./Action";

export interface Node {
    state: State,
    parent: Node | null | undefined,
    action: Action,
    cost: number,
}

export const makeNode = ( problem: Problem, parent: Node, action: Action ): Node =>  {
    const newState: State = problem.result( parent.state, action );
    
    return {
        state: newState,
        parent,
        action,
        cost: parent.cost + problem.cost(parent.state, action),
    }
}

export const compareNodes = ( n1: Node, n2: Node ) => {
    return compareStates(n1.state, n2.state) && n1.parent === n2.parent &&
        compareActions( n1.action, n2.action ) && n1.cost === n2.cost;
}