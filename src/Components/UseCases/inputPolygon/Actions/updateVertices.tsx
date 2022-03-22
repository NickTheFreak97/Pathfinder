import { UPDATE_NEW_POLY_VERTICES } from "../../../Redux/Actions/ActionTypes";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";

export const updateVertices = ( vertices: Vertex[] ) => {
    return {
        type: UPDATE_NEW_POLY_VERTICES,

        payload: {
            vertices,
        }
    }
}