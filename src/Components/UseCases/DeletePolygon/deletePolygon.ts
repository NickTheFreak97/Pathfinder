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
import { computeAABB } from "../../Utils/AABBTree/Adapters/Poly2BoxAdapter";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { AABBTree, Node } from "../../Utils/AABBTree/aabbtree";
import { Box } from "../../Utils/AABBTree/box";

const _deletePolygon = (polygonID: string) : Action => {
    return {
        type: DELETE_POLYGON,

        payload: {
            polygonID
        }
    }
}

export const deletePolygon = (event: Konva.KonvaEventObject<MouseEvent>) => (dispatch: Dispatch<any>, state: () => State ) => {

    if( event.target !== event.target.getStage() ) {
        const selectedPolygonID: string | null | undefined = state().selectedPolygonID;
        const startPoint: PointInfo | null | undefined = state().startPoint;
        const destinationPoint: PointInfo | null | undefined = state().destinationPoint;
        const selectedShape: string | null | undefined = event?.target?.name();
        const AABBTree: AABBTree = state().AABBTree;

        const thisPolygon = state().polygons.find( (p: Polygon) => p.id === selectedShape );
        if( !!thisPolygon ) {
            AABBTree.queryRegion( computeAABB( thisPolygon.transformedVertices ) ).filter(
                (n: Node) => !!n.entity && (n.entity as Box).id === selectedShape
            ).forEach(
                (n: Node) => AABBTree.remove(n)
            )
        }
        
        if( !!selectedShape && validate(selectedShape) ) {
            dispatch(_deletePolygon(selectedShape));


            if( selectedPolygonID === selectedShape ) 
                dispatch(setPolygonID(null));
            
            if( startPoint?.id.includes( selectedShape ) ) {
                dispatch(setStartPoint(undefined));
            }
            if( destinationPoint?.id.includes(selectedShape) )
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