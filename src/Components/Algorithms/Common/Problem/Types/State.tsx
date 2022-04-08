import { Vertex } from "../../../../GUIElements/Types/Shapes/PolygonGUIProps";
import { extractID } from "../../VisibilityMap/VisibilityMap";

export interface State {
    value: [Vertex, Vertex]
}
/* 
const compareVertices = ( v1: Vertex, v2: Vertex ) : boolean => {
    return (v1[0] === v2[0] && v1[1] === v2[1]);
} */

/**
 *  * @returns true if the two states are equals, false otherwise
 */
export const compareStates = ( s1: State, s2: State ) : boolean => {

    return  `${extractID(s1.value[0])}->${extractID(s1.value[1])}` 
            === `${extractID(s2.value[0])}->${extractID(s2.value[1])}`
}

export const toString = ( state: State ) : string => {
    return `(${state.value[0][0]},${state.value[0][1]})-->(${state.value[1][0]},${state.value[1][1]})`
}