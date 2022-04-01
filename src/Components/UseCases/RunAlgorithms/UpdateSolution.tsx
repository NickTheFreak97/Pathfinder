import { Action } from "../../Algorithms/Common/Problem/Types/Action";
import { Action as ReduxAction } from "../../GUIElements/Types/Redux/Action";
import { UPDATE_SOLUTION } from "../../Redux/Actions/ActionTypes";

export const updateSolution = ( solution: Action[] | null | undefined ): ReduxAction => {
    return {
        type: UPDATE_SOLUTION, 

        payload: {
            solution
        }
    }
}