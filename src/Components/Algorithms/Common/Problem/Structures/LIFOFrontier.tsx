import { Frontier } from "../Types/Problem";
import { Node, compareNodes } from "../Types/Node";

export class LIFOFrontier implements Frontier {
    queue: Array<Node>;

    constructor() {
        this.queue = [];
    }

    contains = (node: Node) : boolean => {
        return this.queue.findIndex( (element: Node) => compareNodes( element, node ) ) !== -1;
    }

    getFirst = () : Node | undefined => {
        return this.queue.shift();
    }

    isEmpty = () : boolean => {
        return this.queue.length <= 0;
    } 

    push = (node: Node) : Array<Node> => {
        this.queue.splice(0, 0, node);
        return this.queue;
    }

    clear = (): void => {
        this.queue = [];
    }

    size = (): number => {
        return this.queue.length;
    }

}