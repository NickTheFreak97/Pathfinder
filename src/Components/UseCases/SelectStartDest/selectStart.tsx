import Konva from "konva";
import { Dispatch } from "react";
import { setExtremumPoint, ExtremumPoint, resetSolution } from "./Common/setExtremumPoint";
import { SET_START_POINT } from "../../Redux/Actions/ActionTypes";

import { PointInfo } from "../../GUIElements/Types/Shapes/PointInfo";
import { Action } from "../../GUIElements/Types/Redux/Action";
import { State } from "../../GUIElements/Types/Redux/State";
import { updateSolution } from "../RunAlgorithms/Actions/UpdateSolution";



export const _setStartPoint = (startPoint: PointInfo | null | undefined) : Action => {
    return {
        type: SET_START_POINT,

        payload: {
            startPoint
        }
    }
}

export const setStartPoint = ( event: Konva.KonvaEventObject<MouseEvent> | null | undefined) => (dispatch: Dispatch<any>, getState: ()=> State) => {
    dispatch( setExtremumPoint(event, ExtremumPoint.START) );
    if( !!getState().solution )
        dispatch( updateSolution(undefined) );
    
    dispatch( resetSolution() );
}