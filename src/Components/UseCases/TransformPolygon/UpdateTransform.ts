import Konva from "konva";
import { validate } from "uuid";

import { UPDATE_POLYGON_TRANSFORM } from "../../Redux/Actions/ActionTypes";

import { Dispatch } from "react";
import { State } from "../../GUIElements/Types/Redux/State";
import { updateSolution } from "../RunAlgorithms/Actions/UpdateSolution";
import { updateVisibilityMap } from "../RunAlgorithms/Actions/updateVisibilityMap";
import { setFrontier } from "../SetDataStructures/setFrontier";
import { setExplored } from "../SetDataStructures/setExplored";
import { ThreeOrMoreVertices, toPoint, Vertex } from "../../GUIElements/Types/Shapes/PolygonGUIProps";
import { computeAABB } from "../../Utils/AABBTree/Adapters/Poly2BoxAdapter";
import { toVertex } from "../../GUIElements/Types/Shapes/Point";
import * as Utils from "./utils";

import { Point } from "../../GUIElements/Types/Shapes/Point";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { Action } from "../../GUIElements/Types/Redux/Action";
import { PointInfo } from "../../GUIElements/Types/Shapes/PointInfo";
import { _setStartPoint } from "../SelectStartDest/selectStart";
import { _setDestinationPoint } from "../SelectStartDest/selectDestination";
import { AABB } from "../../Utils/AABBTree/aabb";

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
            transform,
            transformedVertices: [...currentPolygons[ polyIndex ].vertices.map( 
                    (vertex: Vertex) : Vertex =>
                        toVertex(transform.point( toPoint(vertex) as Konva.Vector2d ) as Point)
                ) ] as ThreeOrMoreVertices,
            overlappingPolygonsID: [],
        }
        const newPoly: Polygon[] = [ ...currentPolygons ];
        const prevAABB: AABB = computeAABB(currentPolygons[polyIndex].transformedVertices);
        const nextAABB: AABB = computeAABB(thisPoly.transformedVertices);

        Utils.handlePointInside(thisPoly, startPoint, destinationPoint);
        Utils.handleTransformPoints(thisPoly, dispatch, transform, startPoint, destinationPoint);
        Utils.handleUpdateOverlaps(thisPoly, newPoly, getState().AABBTree, prevAABB, nextAABB);
        Utils.handleUpdateTree( getState().AABBTree, prevAABB, nextAABB, thisPoly );
        
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