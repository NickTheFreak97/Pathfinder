
import { CHANGE_INTERACTION_MODE, POLYGON_ADDED, SET_CURRENT_POINT, UPDATE_NEW_POLY_VERTICES } from '../Actions/ActionTypes';
import { InteractionMode } from '../../Utils/interactionMode';
import { Action } from '../../GUIElements/Types/Redux/Action';
import { State } from '../../GUIElements/Types/Redux/State';

const initialState = {
    polygons: [], 
    useMode: InteractionMode.DRAW_POLYGON,
    currentPoint: undefined, 
    newPolygonVertices: [],
}

const rootReducer = ( state : State = initialState, action: Action ) => {
        
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

        case SET_CURRENT_POINT: {
            return {
                ...state,
                currentPoint: action.payload.point,
            }
        }

        case UPDATE_NEW_POLY_VERTICES: {
            return {
                ...state,
                newPolygonVertices: action.payload.vertices,
            }
        }

        default:
            return state;
    }
} 

export default rootReducer;