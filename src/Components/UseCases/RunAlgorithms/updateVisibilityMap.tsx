import { VisibilityMap } from "../../Algorithms/Common/VisibilityMap/VisibilityMap";
import { Action } from "../../GUIElements/Types/Redux/Action";
import { UPDATE_VISIBILITY_MAP } from "../../Redux/Actions/ActionTypes";

export const updateVisibilityMap = (visibilityMap: VisibilityMap | null | undefined) : Action => {
    return {
        type: UPDATE_VISIBILITY_MAP,

        payload: {
            visibilityMap,
        }
    }
}