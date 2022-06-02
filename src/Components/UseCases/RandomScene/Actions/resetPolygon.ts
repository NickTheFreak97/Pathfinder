import { Action } from "../../../GUIElements/Types/Redux/Action";
import { RESET_POLYGONS } from "../../../Redux/Actions/ActionTypes";

export const resetPolygons = (): Action => {
    return {
        type: RESET_POLYGONS,

        payload: {
            
        }
    }
}