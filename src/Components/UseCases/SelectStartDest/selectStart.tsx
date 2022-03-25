import Konva from "konva";
import { validate, v4 as uuidv4 } from "uuid";
import { Dispatch } from "react";

import { SET_START_POINT } from "../../Redux/Actions/ActionTypes";

import { PointInfo } from "../../GUIElements/Types/Shapes/PointInfo";
import { Action } from "../../GUIElements/Types/Redux/Action";
import { State } from "../../GUIElements/Types/Redux/State";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";

export const _setStartPoint = (startPoint: PointInfo | null | undefined) : Action => {
    return {
        type: SET_START_POINT,

        payload: {
            startPoint
        }
    }
}

const handleClickOnStage = ( event: Konva.KonvaEventObject<MouseEvent> ) => (dispatch: Dispatch<Action>, getState: ()=> State) => {
    const thePoint = event.target?.getStage()?.getPointerPosition();
        if( !!thePoint ) {
            dispatch(_setStartPoint({
                id: uuidv4(),
                coordinates: thePoint
            }))
        }
}

const handleClickOnPolygonVertex = ( event: Konva.KonvaEventObject<MouseEvent> ) => (dispatch: Dispatch<Action>, getState: ()=> State) => {
    
    const groupID: string | undefined = event.target.parent?.name();
    if( !!groupID && !validate(groupID) ) {

        const parentPolygonID: string = groupID.substring(0, 36); 

        if( validate(parentPolygonID) ) { 

            const polygons: Polygon[]= getState().polygons;
            const parentPolygon: Polygon | undefined = polygons.find( (polygon: Polygon): boolean => polygon.id === parentPolygonID );

            if( !!parentPolygon ) {

                if( parentPolygon.isConvex === false )
                    return;

                const pointNumber: number = parseInt(groupID.substring(39, groupID.length));

                if( !isNaN(pointNumber) ) {
                    dispatch(_setStartPoint({
                        id: groupID,
                        coordinates: {
                            x: parentPolygon.vertices[pointNumber][0],
                            y: parentPolygon.vertices[pointNumber][1],
                        }
                    }))
                }

            }
        }

    }
}

export const setStartPoint = ( event: Konva.KonvaEventObject<MouseEvent> | null | undefined) => (dispatch: Dispatch<any>, getState: ()=> State) => {
    const startPoint = getState().startPoint;
    
    if( !event )
        dispatch(_setStartPoint(event))

    if( !!startPoint )
        return;
    
    if( event?.target === event?.target?.getStage() ) { 
        dispatch(handleClickOnStage(event!));
    } else {
        dispatch(handleClickOnPolygonVertex(event!));
    }
}