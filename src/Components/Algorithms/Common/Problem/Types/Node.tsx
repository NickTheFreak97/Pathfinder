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
    return `(${n1.parent?.action[0]},${n1.parent?.action[1]})-->(${n1.action[0]},${n1.action[1]})` ===
            `(${n2.parent?.action[0]},${n2.parent?.action[1]})-->(${n2.action[0]},${n2.action[1]})`;
}