import { Vertex } from "../../../../GUIElements/Types/Shapes/PolygonGUIProps";

export interface State {
    value: [Vertex, Vertex]
}

const compareVertices = ( v1: Vertex, v2: Vertex ) : boolean => {
    return (v1[0] === v2[0] && v1[1] === v2[1]);
}

export const compareStates = ( s1: State, s2: State ) : boolean => {
    return  compareVertices( s1.value[0], s2.value[0] ) && 
            compareVertices( s1.value[1], s2.value[1] );
}

export const toString = ( state: State ) : string => {
    return `(${state.value[0][0]},${state.value[0][1]})-->(${state.value[1][0]},${state.value[1][1]})`
}