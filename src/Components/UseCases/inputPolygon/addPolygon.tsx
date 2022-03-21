import { POLYGON_ADDED } from '../../Redux/Actions/ActionTypes';
import { Polygon } from '../../GUIElements/Types/Shapes/Polygon';

export const addPolygon = ( polygon: Polygon ) => ({
    type: POLYGON_ADDED,

    payload: {
        polygon
    }
})