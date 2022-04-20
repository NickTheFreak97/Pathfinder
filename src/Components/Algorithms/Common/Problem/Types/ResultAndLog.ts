import { Action } from "./Action";
import { Analytics } from "./Analytics";

export interface SolutionAndLog {
    solution: Action[] | null,
    log?: Analytics
}

export const makeSolutionAndLog = ( solution: Action[] | null, log?: Analytics ): SolutionAndLog => {
    return {
        solution, 
        log,
    }
}