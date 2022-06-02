import { REMOVE_RANDOM_POLYGON_CIRCLE } from "../../../Redux/Actions/ActionTypes";

export const removeRandomPolygonCircle = (id: string) => {
    return {
        type: REMOVE_RANDOM_POLYGON_CIRCLE,

        payload: {
            id
        }
    }
}