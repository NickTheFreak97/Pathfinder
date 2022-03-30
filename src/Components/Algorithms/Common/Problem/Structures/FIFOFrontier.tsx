import { Frontier } from "../Types/Problem";
import { State, compareStates } from "../Types/State";

export class FIFOFrontier implements Frontier {
    queue: Array<State>;

    constructor() {
        this.queue = [];
    }

    contains = (state: State) : boolean => {
        return this.queue.findIndex( (element: State) => compareStates( element, state ) ) !== -1;
    }

    getFirst = () : State | undefined => {
        return this.queue.pop();
    }

    isEmpty = () : boolean => {
        return this.queue.length <= 0;
    } 

    push = (state: State) : void => {
        this.queue.splice(0,0,state);
    }

    clear = (): void => {
        this.queue = [];
    }

}