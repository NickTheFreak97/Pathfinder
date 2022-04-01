import Konva from "konva";
import { Dispatch } from 'react';

import { setExtremumPoint, ExtremumPoint } from "./Common/setExtremumPoint";

import { SET_DESTINATION_POINT } from "../../Redux/Actions/ActionTypes"

import { PointInfo } from "../../GUIElements/Types/Shapes/PointInfo"
import { Action } from "../../GUIElements/Types/Redux/Action"
import { State } from "../../GUIElements/Types/Redux/State";
import { updateSolution } from "../RunAlgorithms/UpdateSolution";

export const _setDestinationPoint = (destinationPoint: PointInfo | null | undefined) : Action => {
    return {
        type: SET_DESTINATION_POINT,

        payload: {
            destinationPoint
        }
    }
}

export const setDestinationPoint = ( event: Konva.KonvaEventObject<MouseEvent> | null | undefined) => (dispatch: Dispatch<any>, getState: ()=> State) => {
    dispatch( setExtremumPoint(event, ExtremumPoint.DESTINATION) );
    if( !!getState().solution )
        dispatch( updateSolution(undefined) );
}