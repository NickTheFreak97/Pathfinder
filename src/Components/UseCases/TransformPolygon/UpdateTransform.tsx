import Konva from "konva";

import { UPDATE_POLYGON_TRANSFORM } from "../../Redux/Actions/ActionTypes";

import { pointInPolygon } from "../PointInPolygon/pointInPolygon";
import { Dispatch } from "react";
import { State } from "../../GUIElements/Types/Redux/State";
import { updateSolution } from "../RunAlgorithms/Actions/UpdateSolution";
import { updateVisibilityMap } from "../RunAlgorithms/Actions/updateVisibilityMap";
import { setFrontier } from "../SetDataStructures/setFrontier";
import { setExplored } from "../SetDataStructures/setExplored";

import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { Action } from "../../GUIElements/Types/Redux/Action";
import { PointInfo } from "../../GUIElements/Types/Shapes/PointInfo";



const _updateTransform = ( polygons: Polygon[] ) : Action=> {
    return {
        type: UPDATE_POLYGON_TRANSFORM, 

        payload: {
            polygons
        }
    }
}

export const updateTransform = ( polygonID: string, transform: Konva.Transform ) => (dispatch: Dispatch<Action>, getState: () => State) => {
    const currentPolygons: Polygon[] = getState().polygons;
    const startPoint: PointInfo | null | undefined = getState().startPoint;
    const destinationPoint: PointInfo | null | undefined = getState().destinationPoint;

    const polyIndex: number = currentPolygons.findIndex( (polygon: Polygon) => polygon.id === polygonID );
    if( polyIndex !== -1 ) {
        
        const thisPoly: Polygon = {
            ...currentPolygons[ polyIndex ], 
            transform
        }
        const newPoly: Polygon[] = [ ...currentPolygons ];
        
        let pointInside: boolean = false;
        if( !!startPoint )
            pointInside = pointInside || pointInPolygon( startPoint.coordinates, thisPoly );

        if( !!destinationPoint )
            pointInside = pointInside || pointInPolygon( destinationPoint.coordinates, thisPoly );
        
        Object.assign( thisPoly, { pointInside: pointInside } );
        
        newPoly.splice( polyIndex, 1, thisPoly );

        dispatch( _updateTransform( newPoly ) );

        if( !!getState().solution )
            dispatch(updateSolution(null));

        if( !!getState().visibilityMap )
            dispatch( updateVisibilityMap(null) );

        if( !!getState().frontier )
            setFrontier(null);

        if( !!getState().explored )
            setExplored(null);
    }
} 