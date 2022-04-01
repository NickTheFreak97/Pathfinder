import { Vertex } from "../../../../GUIElements/Types/Shapes/PolygonGUIProps";

export type Action = Vertex;

export const compareActions = ( a1: Action, a2: Action ) : boolean => {
    return a1[0] === a2[0] && a1[1] === a2[1]
}