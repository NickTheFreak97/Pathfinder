
import { CHANGE_INTERACTION_MODE, POLYGON_ADDED, SET_CURRENT_POINT, UPDATE_NEW_POLY_VERTICES, SET_SELECTED_POLYGON_ID, 
         DELETE_POLYGON, SET_START_POINT, SET_DESTINATION_POINT } from '../Actions/ActionTypes';
import { InteractionMode } from '../../Utils/interactionMode';
import { Action } from '../../GUIElements/Types/Redux/Action';
import { State } from '../../GUIElements/Types/Redux/State';
import { Polygon } from '../../GUIElements/Types/Shapes/Polygon';

const initialState = {
    polygons: [], 
    useMode: InteractionMode.DRAW_POLYGON,
    currentPoint: undefined, 
    newPolygonVertices: [],
    selectedPolygonID: undefined,
    startPoint: undefined,
    destinationPoint: undefined,
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

        case SET_SELECTED_POLYGON_ID: {
            return {
                ...state, 
                selectedPolygonID: action.payload.polygonID,
            }
        }

        case DELETE_POLYGON: {
            return {
                ...state, 
                polygons: [...state.polygons].filter( (polygon: Polygon) :boolean => polygon.id !== action.payload.polygonID )
            }
        }

        case SET_START_POINT: {
            return {
                ...state,
                startPoint: action.payload.startPoint
            }
        }

        case SET_DESTINATION_POINT: {
            return {
                ...state,
                destinationPoint: action.payload.destinationPoint
            }
        }

        default:
            return state;
    }
} 

export default rootReducer;