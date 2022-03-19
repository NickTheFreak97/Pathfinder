
import { POLYGON_ADDED } from '../Actions/ActionTypes';

const initialState = {
    polygons: {}, 
}

const rootReducer = ( state = initialState, action ) => {
        
    switch ( action.type ) {
        
        case POLYGON_ADDED: 
            return {
                ...state,
                polygons: {...state.polygons, ...action.payload.polygon},
            }

        default:
            return state;
    }
} 

export default rootReducer;