import { Action } from "../../../GUIElements/Types/Redux/Action";
import { UPDATE_RUNNING_OPTIONS } from "../../../Redux/Actions/ActionTypes";

export interface RunningOptions {
    computeEBF: boolean,
    verbose: {
        show: {
            frontier: boolean,
            explored: boolean,
            visibility: boolean,
            solution: boolean, 
            hitboxes: boolean,
            randomPolygonCircles: boolean,
        }

        opacity: {
            frontier: number,
            explored: number,
            visibility: number,
            solution: number, 
            hitboxes: number,
            randomPolygonCircles: number,
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