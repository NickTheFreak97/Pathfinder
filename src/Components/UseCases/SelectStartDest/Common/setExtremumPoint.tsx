import Konva from "konva";
import { Dispatch } from "react";
import { v4 as uuidv4, validate } from "uuid";
import { _setStartPoint } from "../selectStart";
import { _setDestinationPoint } from "../selectDestination";

import { State } from "../../../GUIElements/Types/Redux/State";
import { Action } from "../../../GUIElements/Types/Redux/Action";
import { PointInfo } from "../../../GUIElements/Types/Shapes/PointInfo";
import { Polygon } from "../../../GUIElements/Types/Shapes/Polygon";

export enum ExtremumPoint {
    START= "START",
    DESTINATION= "DESTINATION"
}

const handleClickOnStage = ( event: Konva.KonvaEventObject<MouseEvent>, mode: ExtremumPoint ) => 
        (dispatch: Dispatch<Action>, getState: ()=> State) => {
    
    const setPoint: (point: PointInfo | null | undefined) => Action = 
            (mode === ExtremumPoint.START) ? 
                _setStartPoint : _setDestinationPoint;

    const thePoint = event.target?.getStage()?.getPointerPosition();
        if( !!thePoint ) {
            dispatch(setPoint({
                id: uuidv4(),
                coordinates: thePoint
            }))
        }

}

const handleClickOnPolygonVertex = ( event: Konva.KonvaEventObject<MouseEvent>, mode: ExtremumPoint ) => 
    (dispatch: Dispatch<Action>, getState: ()=> State) => {

    const setPoint: (point: PointInfo | null | undefined) => Action = 
        (mode === ExtremumPoint.START) ? 
            _setStartPoint : _setDestinationPoint;
    
    const theOtherExtremum: PointInfo | null | undefined = 
        ( mode === ExtremumPoint.START ) ?
            getState().destinationPoint :
            getState().startPoint
    
    const groupID: string | undefined = event.target.parent?.name();
    if( groupID === theOtherExtremum?.id )
        return;
        
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
                    dispatch(setPoint({
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


export const setExtremumPoint = ( event: Konva.KonvaEventObject<MouseEvent> | null | undefined, mode: ExtremumPoint  ) => (dispatch: Dispatch<any>, getState: ()=> State) => {
    
    const extremumPoint = ( mode === ExtremumPoint.START ) ? getState().startPoint : getState().destinationPoint;
    const setPoint: (point: PointInfo | null | undefined) => Action = 
    (mode === ExtremumPoint.START) ? 
        _setStartPoint : _setDestinationPoint;

    
    if( !event )
        dispatch(setPoint(event))

    if( !!extremumPoint )
        return;
    
    if( event?.target === event?.target?.getStage() ) { 
        dispatch(handleClickOnStage(event!, mode));
    } else {
        dispatch(handleClickOnPolygonVertex(event!, mode));
    }
}