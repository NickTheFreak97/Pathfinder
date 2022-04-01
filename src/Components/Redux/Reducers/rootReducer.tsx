
import { CHANGE_INTERACTION_MODE, POLYGON_ADDED, SET_CURRENT_POINT, UPDATE_NEW_POLY_VERTICES, SET_SELECTED_POLYGON_ID, 
         DELETE_POLYGON, SET_START_POINT, SET_DESTINATION_POINT, SET_FRONTIER, SET_EXPLORED, PUSH_FRONTIER, UPDATE_RUNNING_OPTIONS, UPDATE_VISIBILITY_MAP,
         POP_FRONTIER, PUSH_EXPLORED, UPDATE_SOLUTION} from '../Actions/ActionTypes';
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

    visibilityMap: undefined,
    frontier: undefined,
    explored: undefined,

    options: {
        computeEFB: false,
        verbose: false,
        log: false
    },

    solution: null,
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

        case UPDATE_VISIBILITY_MAP: {
            return {
                ...state,
                visibilityMap: action.payload.visibilityMap,
            }
        }

        case SET_FRONTIER: {
            return {
                ...state,
                frontier: action.payload.frontier,
            }
        }

        case PUSH_FRONTIER: {
            return {
                ...state,
                frontier: action.payload.frontier,
            }
        }

        case POP_FRONTIER: {
            return {
                ...state,
                frontier: action.payload.frontier,
            }
        }

        case SET_EXPLORED: {
            return {
                ...state,
                explored: action.payload.explored
            }
        }

        case PUSH_EXPLORED: {
            return {
                ...state,
                explored: { ...state.explored, [action.payload.stateID]: true }
            }
        }

        case UPDATE_RUNNING_OPTIONS: {
            return {
                ...state,
                options: action.payload.options,
            }
        }

        case UPDATE_SOLUTION: {
            return {
                ...state, 
                solution: action.payload.solution
            }
        }
        
        default:
            return state;
    }
} 

export default rootReducer;