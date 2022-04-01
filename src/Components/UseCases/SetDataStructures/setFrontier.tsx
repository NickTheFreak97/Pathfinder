import { SET_FRONTIER } from "../../Redux/Actions/ActionTypes"
import { Frontier } from "../../Algorithms/Common/Problem/Types/Problem"
import { Action } from "../../GUIElements/Types/Redux/Action"

export const setFrontier = (frontier: Frontier) : Action => {
    return {
        type: SET_FRONTIER,

        payload: {
            frontier
        }
    }
}