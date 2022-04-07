import { _UniformCost } from "./UniformCost";
import { store } from "../Redux/Store/store";

import { Problem } from "./Common/Problem/Types/Problem";
import { Action } from "./Common/Problem/Types/Action";
import { PointInfo } from "../GUIElements/Types/Shapes/PointInfo";
import { Node } from "./Common/Problem/Types/Node";

export const AStar = ( problem: Problem ) => {
    return new Promise<Action[] | null>( (resolve, reject)=>{
        const destPoint: PointInfo = store.getState().destinationPoint!;
        const result: Action[] | null = _UniformCost(
            problem,
            ( node: Node ) => 
                node.cost + 
                ( (node.state.value[1][0]-destPoint.coordinates.x! )*(node.state.value[1][0]-destPoint.coordinates.x! ) +
                  (node.state.value[1][1]-destPoint.coordinates.y! )*(node.state.value[1][1]-destPoint.coordinates.y! ) )
        )

        if( !!result )
            resolve(result);
        else
            reject(result);
    } ); 
}