import Konva from "konva";
import { Dispatch } from "react";
import { validate } from "uuid";

import { DELETE_POLYGON } from "../../Redux/Actions/ActionTypes";
import { Action } from "../../GUIElements/Types/Redux/Action";
import { setPolygonID } from "../SelectPolygon/setPolygonID";

import { State } from "../../GUIElements/Types/Redux/State";
import { PointInfo } from "../../GUIElements/Types/Shapes/PointInfo";
import { setStartPoint } from "../SelectStartDest/selectStart";
import { setDestinationPoint } from "../SelectStartDest/selectDestination";

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
        const destinationPoint: PointInfo | null | undefined = getState().destinationPoint;
        const selectedShape: string | null | undefined = event?.target?.name();
        
        if( !!selectedShape && validate(selectedShape) ) {
            dispatch(_deletePolygon(selectedShape));

            if( selectedPolygonID === selectedShape ) 
                dispatch(setPolygonID(null));
            
            if( startPoint?.id === event?.target?.parent?.name() ) {
                dispatch(setStartPoint(undefined));
                console.log(startPoint?.id, event?.target?.parent?.name(), "Firing delete start event");
            }
            if( destinationPoint?.id === event?.target?.parent?.name() )
                dispatch(setDestinationPoint(undefined));

        } else {
            const pointID: string | undefined = event.target?.parent?.name();
            if( !!pointID ) {
                if( pointID === startPoint?.id )
                    dispatch(setStartPoint(undefined));
                else
                    if( pointID === destinationPoint?.id )
                        dispatch(setDestinationPoint(undefined));
            }
        }
    
    } 

}