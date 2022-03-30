import { State } from "./State";
import { Vertex } from "../../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Action } from "./Action";

export interface Problem {
    initialState: State,
    actions: (state: State) => Vertex[],
    result: (state: State, vertex: Vertex) => State,
    cost: (s: State, a: Action) => number,
    goalTest: (state: State) => boolean,
}

/** To be extended as FIFOFrontier, LIFOFrontier, PQFrontier */
export interface Frontier {
    queue: Array<State>,
    contains: (state: State) => boolean,
    getFirst: () => State | undefined,
    isEmpty: () => boolean,
    push: ( state: State ) => void,
    clear: () => void,
}

export interface Expanded {
    [key: string] : boolean
}