
import { CHANGE_INTERACTION_MODE, POLYGON_ADDED } from '../Actions/ActionTypes';
import { InteractionMode } from '../../Utils/interactionMode';
import { Action } from '../../GUIElements/Types/Redux/Action';

const initialState = {
    polygons: [], 
    useMode: InteractionMode.DRAW_POLYGON,
}

const rootReducer = ( state = initialState, action: Action ) => {
        
    switch ( action.type ) {
        
        case POLYGON_ADDED: 
            return {
                ...state,
                polygons: [...state.polygons, action.payload.polygon],
            }

        case CHANGE_INTERACTION_MODE: {
            return {
                ...state,
                useMode: action.payload.mode,
            }
        }

        default:
            return state;
    }
} 

export default rootReducer;