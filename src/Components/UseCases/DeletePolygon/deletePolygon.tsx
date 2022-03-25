import Konva from "konva";
import { Dispatch } from "react";
import { validate } from "uuid";

import { DELETE_POLYGON } from "../../Redux/Actions/ActionTypes";
import { Action } from "../../GUIElements/Types/Redux/Action";
import { setPolygonID } from "../SelectPolygon/setPolygonID";

import { State } from "../../GUIElements/Types/Redux/State";
import { PointInfo } from "../../GUIElements/Types/Shapes/PointInfo";
import { setStartPoint } from "../SelectStartDest/selectStart";

const _deletePolygon = (polygonID: string) : Action => {
    return {
        type: DELETE_POLYGON,

        payload: {
            polygonID
        }
    }
}

export const deletePolygon = (event: Konva.KonvaEventObject<MouseEvent>) => (dispatch: Dispatch<any>, getState: () => State ) => {

    if( event.target !== event.target.getStage() ) {
        const selectedPolygonID: string | null | undefined = getState().selectedPolygonID;
        const startPoint: PointInfo | null | undefined = getState().startPoint;
        const selectedShape: string | null | undefined = event?.target?.name();
        
        if( !!selectedShape && validate(selectedShape) ) {
            dispatch(_deletePolygon(selectedShape));
            if( selectedPolygonID === selectedShape ) 
                dispatch(setPolygonID(null));
            if( startPoint?.id.includes( selectedShape ) ) {
                dispatch(setStartPoint(undefined));
            }
        } else {
            dispatch(setStartPoint(undefined));
        }
    
    } 

}