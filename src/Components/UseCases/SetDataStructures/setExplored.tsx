import { SET_EXPLORED } from "../../Redux/Actions/ActionTypes";
import { Action } from "../../GUIElements/Types/Redux/Action";
import { Explored } from "../../Algorithms/Common/Problem/Types/Problem";

export const setExplored = ( explored: Explored ) : Action => {
    return {
        type: SET_EXPLORED, 

        payload: {
            explored,
        }
    }
}