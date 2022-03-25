import Konva from "konva";
import { validate } from "uuid";
import { Dispatch } from "react";
import { SET_SELECTED_POLYGON_ID } from "../../Redux/Actions/ActionTypes"
import { Action } from "../../GUIElements/Types/Redux/Action";
import { State } from "../../GUIElements/Types/Redux/State";

const setPolygonID = (polygonID: string | null | undefined) => {
    return {
        type: SET_SELECTED_POLYGON_ID,

        payload: {
            polygonID,
        }
    }
}

export const handlePolygonSelection = (event: Konva.KonvaEventObject<MouseEvent>) => (dispatch: Dispatch<Action>, getState: ()=> State) => {
    const selPolyID: string | null | undefined = getState().selectedPolygonID;
    const selectedShape: string | null | undefined = event?.target?.name();

    if( event.target !== event.target.getStage() ) {
        if( !!selectedShape && selectedShape !== selPolyID && validate(selectedShape)) {
            dispatch(setPolygonID(selectedShape));
        }
    } else
        if( !!selPolyID )
            dispatch(setPolygonID(null));

}