import { Frontier } from "../Types/Problem";
import { Node, compareNodes } from "../Types/Node";
import { compareStates, State } from "../Types/State";
import { toString } from "../Types/State";
/**
 * An adaptation of the following code: 
 * https://www.davideaversa.it/blog/typescript-binary-heap/
 */
 export class MinPQFrontier implements Frontier {
    queue: Array<Node>;
    statesMap: Map<String, number>;
    priority: (node: Node) => number;

    constructor(priority: (node: Node) => number) {
        this.queue = [];
        this.statesMap = new Map<String, number>();
        this.priority = priority;
    }

    push = (node: Node) : Array<Node> => {
        this.queue.push(node);
        this.statesMap.set(toString(node.state), this.queue.length-1);
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

        this.statesMap.delete(toString(result.state));
        return result;
    }

    isEmpty = (): boolean => {
        return this.queue.length <= 0;
    }

    clear = (): void => {
        this.queue = [];
        this.statesMap.clear();
    }

    contains = (node: Node) : boolean => {
        return this.queue.findIndex( (element: Node) => compareNodes( element, node ) ) !== -1;
    }

    containsState = ( state: State ) => {
        return this.statesMap.has(toString(state));
    }

    replaceIfBetter = ( node: Node ) => {
        const index: number | undefined = this.statesMap.get(toString(node.state));
        if( index && this.priority( node ) < this.priority( this.queue[index] )) {
            this.remove( this.queue[index] );
            this.push( node );
        }
    } 

    size = () => {
        return this.queue.length;
    }

    private remove(node: Node) {
        const index: number | undefined = this.statesMap.get(toString(node.state));
        if( index ) {
            let end = this.queue.pop();
            this.queue[index] = end!;
            this.bubbleUp(index);
            this.sinkDown(index);
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

            this.statesMap.set(toString(element.state), parentN);
            this.statesMap.set(toString(parent.state), n);

            n = parentN;
        }
    }

    private sinkDown(n: number) {
        var length = this.queue.length, 
            element = this.queue[n], 
            elemScore = this.priority(element);

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

            this.statesMap.set(toString(this.queue[swap].state), n);
            this.statesMap.set(toString(element.state), swap);

            n = swap;
        }
    }
} 