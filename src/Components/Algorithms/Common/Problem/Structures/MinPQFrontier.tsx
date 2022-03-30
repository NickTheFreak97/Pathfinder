import { State } from "../Types/State";

/**
 * An adaptation of the following code: 
 * https://www.davideaversa.it/blog/typescript-binary-heap/
 */
 export class MinPQFrontier {
    queue: Array<State>;
    priority: (state: State) => number;

    constructor(priority: (state: State) => number) {
        this.queue = [];
        this.priority = priority;
    }

    push = (state: State) : void => {
        this.queue.push(state);
        this.bubbleUp(this.queue.length - 1);
    }

    pop = () : State => {
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