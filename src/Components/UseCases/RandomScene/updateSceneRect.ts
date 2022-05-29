import { Action } from "../../GUIElements/Types/Redux/Action";
import { UPDATE_SCENE_RECT } from "../../Redux/Actions/ActionTypes";

export interface SceneRect {
    width: number,
    height: number,   
}
export const updateSceneRect = (rect: SceneRect): Action => {
    return {
        type: UPDATE_SCENE_RECT, 

        payload: {
            sceneRect: rect,
        }
    }
}