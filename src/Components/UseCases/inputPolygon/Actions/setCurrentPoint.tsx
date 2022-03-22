import { SET_CURRENT_POINT } from '../../../Redux/Actions/ActionTypes';
import { Vertex } from '../../../GUIElements/Types/Shapes/PolygonGUIProps';

export const setCurrentPoint = (point: Vertex | null | undefined) => {
    return {
        type: SET_CURRENT_POINT,

        payload: {
            point
        }
    }
}