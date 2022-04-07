import { Frontier } from "../Types/Problem";
import { Node, compareNodes } from "../Types/Node";
import { compareStates, State } from "../Types/State";
/**
 * An adaptation of the following code: 
 * https://www.davideaversa.it/blog/typescript-binary-heap/
 */
 export class MinPQFrontier implements Frontier {
    queue: Array<Node>;
    priority: (node: Node) => number;

    constructor(priority: (node: Node) => number) {
        this.queue = [];
        this.priority = priority;
    }

    push = (node: Node) : Array<Node> => {
        this.queue.push(node);
        this.bubbleUp(this.queue.length - 1);
        return this.queue;
    }

    getFirst = () : Node | undefined => {
        let result = this.queue[0];
        let end = this.queue.pop();
        if (this.queue.length > 0) {
            this.queue[0] = end!;
            this.sinkDown(0);
        }
        return result;
    }

    isEmpty = (): boolean => {
        return this.queue.length <= 0;
    }

    clear = (): void => {
        this.queue = [];
    }

    contains = (node: Node) : boolean => {
        return this.queue.findIndex( (element: Node) => compareNodes( element, node ) ) !== -1;
    }

    containsState = ( state: State ) => {
        return this.queue.findIndex( (element: Node) => compareStates( state, element.state ) ) !== -1;
    }

    replaceIfBetter = ( node: Node ) => {
        const index: number = this.queue.findIndex( (element: Node) => compareStates( node.state, element.state ) );
        if( index !== -1 && this.priority( node ) < this.priority( this.queue[index] )) {
            this.remove( this.queue[index] );
            this.queue.push( node );
        }
    } 

    private remove(node: Node) {
        let length = this.queue.length;
        for (var i = 0; i < length; i++) {
            if (this.queue[i].state != node.state) 
                continue;
            let end = this.queue.pop();
            if (i == length - 1) 
                break;
            this.queue[i] = end!;
            this.bubbleUp(i);
            this.sinkDown(i);
            break;
        }
    }

    private bubbleUp(n: number) {
        let element = this.queue[n], score = this.priority(element);
        while (n > 0) {
            let parentN = Math.floor((n + 1) / 2) - 1,
                parent = this.queue[parentN];
            if (score >= this.priority(parent))
                break;

            this.queue[parentN] = element;
            this.queue[n] = parent;
            n = parentN;
        }
    }

    private sinkDown(n: number) {
        var length = this.queue.length, element = this.queue[n], elemScore = this.priority(element);

        while (true) {
            var child2N = (n + 1) * 2, child1N = child2N - 1;
            var swap = null;

            if (child1N < length) {
                var child1 = this.queue[child1N], child1Score = this.priority(child1);
                if (child1Score < elemScore)
                    swap = child1N;
            }

            if (child2N < length) {
                var child2 = this.queue[child2N], child2Score = this.priority(child2);
                if (child2Score < (swap == null ? elemScore : child1Score!))
                    swap = child2N;
            }

            if (swap == null)
                break;

            this.queue[n] = this.queue[swap];
            this.queue[swap] = element;
            n = swap;
        }
    }
} 