import Konva from "konva";
import { Dispatch } from 'react';
import { validate } from 'uuid';
import { SATCollisionTest } from "../CollisionDetection/SAT";
import { pointInPolygon } from "../PointInPolygon/pointInPolygon";
import { toPoint } from '../../GUIElements/Types/Shapes/PolygonGUIProps';
import { P2BAdapter } from "../../Utils/AABBTree/Adapters/Poly2BoxAdapter";
import { _setStartPoint } from "../SelectStartDest/selectStart";
import { _setDestinationPoint } from "../SelectStartDest/selectDestination";

import { Action } from "../../GUIElements/Types/Redux/Action";
import { Polygon } from '../../GUIElements/Types/Shapes/Polygon';
import { PointInfo } from '../../GUIElements/Types/Shapes/PointInfo';
import { Box } from '../../Utils/AABBTree/box';
import { AABBTree } from '../../Utils/AABBTree/aabbtree';
import { Node } from "../../Utils/AABBTree/aabbtree";
import { AABB, union } from "../../Utils/AABBTree/aabb";

export const handlePointInside = (polygon: Polygon, startPoint?: PointInfo | null, destPoint?: PointInfo | null) : void => {
    
    if( !!startPoint || !!destPoint ) {
        let pointInside: boolean = false;
        if( !!startPoint && validate(startPoint.id) )
            pointInside = pointInside || pointInPolygon( startPoint.coordinates, polygon );

        if( !!destPoint && validate(destPoint.id) )
            pointInside = pointInside || pointInPolygon( destPoint.coordinates, polygon );
        
        Object.assign( polygon, { pointInside: pointInside } );
    }

}

export const handleTransformPoints = ( polygon: Polygon, dispatch: Dispatch<Action>, transform: Konva.Transform, startPoint?: PointInfo | null, destPoint?: PointInfo | null, ) : void => {
    if( !!startPoint && startPoint.id.includes( polygon.id ) ) {
        const vertexNumber: number = parseInt( startPoint.id.substring(39, startPoint.id.length) );

        dispatch(
            _setStartPoint({
                ...startPoint,
                coordinates: transform.point( toPoint(polygon.vertices[vertexNumber]) as Konva.Vector2d) 
            })
        )
    }
    
    if( !!destPoint && destPoint.id.includes( polygon.id ) ) {
        const vertexNumber: number = parseInt( destPoint.id.substring(39, destPoint.id.length) );

        dispatch(
            _setDestinationPoint({
                ...destPoint,
                coordinates: transform.point( toPoint(polygon.vertices[vertexNumber]) as Konva.Vector2d )
            })
        )
    }
}

export const handleUpdateOverlaps = (polygon: Polygon, allPolygons: Polygon[], tree: AABBTree, prevAABB: AABB, nextAABB: AABB ) : void => {

    const prevBroadlyOverlapped: Box[] = tree.queryRegion( prevAABB ).map(
        (n: Node) => (<Box>n.entity)
    )

    const newBroadlyOverlapped: Box[] = tree.queryRegion( nextAABB ).map(
        (n: Node) => (<Box>n.entity)
    )
    
    prevBroadlyOverlapped.forEach(
        (polyAABB: Box)=>{
            if( polyAABB.id !== polygon.id ) {
                const polyIdx: number = allPolygons.findIndex((p:Polygon) => p.id === polyAABB.id);
                if( polyIdx !== -1 ) {
                    const removeIdx: number = allPolygons[polyIdx].overlappingPolygonsID.findIndex( (pID: string) => polygon.id === pID );
                    if( removeIdx !== -1 )
                    allPolygons[polyIdx].overlappingPolygonsID.splice(removeIdx, 1);
                }
            }
        }
    )

    newBroadlyOverlapped.forEach(
        (polyAABB: Box)=>{
            if( polyAABB.id !== polygon.id ) {
                const polyIdx: number = allPolygons.findIndex((p:Polygon) => p.id === polyAABB.id);
                if( polyIdx !== -1 && SATCollisionTest(polygon, allPolygons[polyIdx])) {
                    polygon.overlappingPolygonsID.push(polyAABB.id!);
                    allPolygons[polyIdx].overlappingPolygonsID.push(polygon.id);
                } else {
                    const removeIdx: number = allPolygons[polyIdx].overlappingPolygonsID.findIndex( (pID: string) => polyAABB.id === pID );
                    if( removeIdx !== -1 )
                    allPolygons[polyIdx].overlappingPolygonsID.splice(removeIdx, 1);
                }

            }
        }
    )
}

export const handleUpdateTree = (tree: AABBTree, prevAABB: AABB, nextAABB: AABB, currentPolygon: Polygon ) : void => {
    const area: AABB = union( prevAABB, nextAABB );
    const nodesToRemove: Node[] = tree.queryRegion( area ).filter(
        (n: Node) => !!n.entity && (n.entity as Box).id === currentPolygon.id
    );

    nodesToRemove.forEach( (n: Node) => tree.remove(n) );
    tree.add( P2BAdapter(currentPolygon) );
}
