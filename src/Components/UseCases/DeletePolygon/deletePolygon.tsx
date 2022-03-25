import Konva from "konva";
import { Dispatch } from "react";
import { validate } from "uuid";

import { DELETE_POLYGON } from "../../Redux/Actions/ActionTypes";
import { Action } from "../../GUIElements/Types/Redux/Action";
import { setPolygonID } from "../SelectPolygon/setPolygonID";

import { State } from "../../GUIElements/Types/Redux/State";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";

const _deletePolygon = (polygonID: string) : Action => {
    return {
        type: DELETE_POLYGON,

        payload: {
            polygonID
        }
    }
}

export const deletePolygon = (event: Konva.KonvaEventObject<MouseEvent>) => (dispatch: Dispatch<Action>, getState: () => State ) => {

    if( event.target !== event.target.getStage() ) {
        const selectedPolygonID: string | null | undefined = getState().selectedPolygonID;
        const selectedShape: string | null | undefined = event?.target?.name();
        
        if( !!selectedShape && validate(selectedShape) ) {
            dispatch(_deletePolygon(selectedShape));
            if( selectedPolygonID === selectedShape ) 
                dispatch(setPolygonID(null));
        }
    
    } 

}