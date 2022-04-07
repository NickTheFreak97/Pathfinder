import { Action } from "../../../GUIElements/Types/Redux/Action";
import { UPDATE_RUNNING_OPTIONS } from "../../../Redux/Actions/ActionTypes";

export interface RunningOptions {
    computeEFB: boolean,
    verbose: {
        show: {
            frontier: boolean,
            explored: boolean,
            visibility: boolean,
            solution: boolean, 
        }

        opacity: {
            frontier: number,
            explored: number,
            visibility: number,
            solution: number, 
        }
    },
    log: boolean
}

export const updateRunningOptions = ( options: RunningOptions ) : Action => {
    return {
        type: UPDATE_RUNNING_OPTIONS,

        payload: {
            options
        }
    }
}