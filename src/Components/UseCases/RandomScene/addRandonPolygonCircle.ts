import { Vertex } from "../../GUIElements/Types/Shapes/PolygonGUIProps";
import { ADD_RANDOM_POLYGON_CIRCLE } from "../../Redux/Actions/ActionTypes";

export interface RandomPolyCircleItem {
    circumCenter: Vertex,
    outerRadius: number, 
    innerRadius: number,
    id: string,
}

export const addRandomPolyCircle = (rpc: RandomPolyCircleItem) => {
    return {
        type: ADD_RANDOM_POLYGON_CIRCLE,

        payload: {
            randomPolyCircle: rpc,
        }
    }
}