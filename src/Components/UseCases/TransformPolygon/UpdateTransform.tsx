import Konva from "konva";
import { validate } from "uuid";

import { UPDATE_POLYGON_TRANSFORM } from "../../Redux/Actions/ActionTypes";

import { pointInPolygon } from "../PointInPolygon/pointInPolygon";
import { Dispatch } from "react";
import { State } from "../../GUIElements/Types/Redux/State";
import { updateSolution } from "../RunAlgorithms/Actions/UpdateSolution";
import { updateVisibilityMap } from "../RunAlgorithms/Actions/updateVisibilityMap";
import { setFrontier } from "../SetDataStructures/setFrontier";
import { setExplored } from "../SetDataStructures/setExplored";
import { ThreeOrMoreVertices, toPoint, Vertex } from "../../GUIElements/Types/Shapes/PolygonGUIProps";
import { P2BAdapter, computeAABB } from "../../Utils/AABBTree/Adapters/Poly2BoxAdapter";
import { toAABB } from "../../Utils/AABBTree/aabb";
import { toVertex } from "../../GUIElements/Types/Shapes/Point";

import { Point } from "../../GUIElements/Types/Shapes/Point";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { Action } from "../../GUIElements/Types/Redux/Action";
import { PointInfo } from "../../GUIElements/Types/Shapes/PointInfo";
import { _setStartPoint } from "../SelectStartDest/selectStart";
import { _setDestinationPoint } from "../SelectStartDest/selectDestination";
import { Node } from "../../Utils/AABBTree/aabbtree";
import { Box } from "../../Utils/AABBTree/box";
import { AABB, union } from "../../Utils/AABBTree/aabb";

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
        
        console.log(currentPolygons[polyIndex].transform === transform);

        const thisPoly: Polygon = {
            ...currentPolygons[ polyIndex ], 
            transform,
            transformedVertices: [...currentPolygons[ polyIndex ].vertices.map( 
                    (vertex: Vertex) : Vertex =>
                        toVertex(transform.point( toPoint(vertex) as Konva.Vector2d ) as Point)
                ) ] as ThreeOrMoreVertices
        }
        const newPoly: Polygon[] = [ ...currentPolygons ];
        

        let pointInside: boolean = false;
        if( !!startPoint && validate(startPoint.id) )
            pointInside = pointInside || pointInPolygon( startPoint.coordinates, thisPoly );

        if( !!destinationPoint && validate(destinationPoint.id) )
            pointInside = pointInside || pointInPolygon( destinationPoint.coordinates, thisPoly );
        
        Object.assign( thisPoly, { pointInside: pointInside } );

        if( !!startPoint && startPoint.id.includes( polygonID ) ) {
            const vertexNumber: number = parseInt( startPoint.id.substring(39, startPoint.id.length) );

            dispatch(
                _setStartPoint({
                    ...startPoint,
                    coordinates: transform.point( toPoint(currentPolygons[polyIndex].vertices[vertexNumber]) as Konva.Vector2d) 
                })
            )
        }
        
        if( !!destinationPoint && destinationPoint.id.includes( polygonID ) ) {
            const vertexNumber: number = parseInt( destinationPoint.id.substring(39, destinationPoint.id.length) );

            dispatch(
                _setDestinationPoint({
                    ...destinationPoint,
                    coordinates: transform.point( toPoint(currentPolygons[polyIndex].vertices[vertexNumber]) as Konva.Vector2d )
                })
            )
        }

        newPoly.splice( polyIndex, 1, thisPoly );
            
        //@FIXME: If the polygon is moved too fast the hitbox doesn't get removed for whatever reason 
        const area: AABB = union( computeAABB(currentPolygons[polyIndex].transformedVertices), computeAABB(thisPoly.transformedVertices) )
        const nodesToRemove: Node[] = getState().AABBTree.queryRegion( area ).filter(
            (n: Node) => !!n.entity && (n.entity as Box).id === thisPoly.id
        );

        nodesToRemove.forEach( (n: Node) => getState().AABBTree.remove(n) );

        getState().AABBTree.add( P2BAdapter(thisPoly) );

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