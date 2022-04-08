import { updateVisibilityMap } from "./Actions/updateVisibilityMap";
import { getVisibilityMap, extractID } from "../../Algorithms/Common/VisibilityMap/VisibilityMap";
import { BFS } from "../../Algorithms/BFS";
import { DFS } from "../../Algorithms/DFS";
import { ID } from "../../Algorithms/ID";
import { UniformCost } from "../../Algorithms/UniformCost";
import { AStar } from "../../Algorithms/AStar";
import { toVertex } from "../../GUIElements/Types/Shapes/Point";
import { updateSolution } from "./Actions/UpdateSolution";

import { Algorithms, SelectedAlgorithms } from "./Types/SelectedAlgorithms";
import { store } from "../../Redux/Store/store";
import { RunningOptions } from "./Types/RunningOptions";
import { Problem } from "../../Algorithms/Common/Problem/Types/Problem";
import { State } from "../../Algorithms/Common/Problem/Types/State";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { PointInfo } from "../../GUIElements/Types/Shapes/PointInfo";
import { Action } from "../../Algorithms/Common/Problem/Types/Action";
import { Vertex } from "../../GUIElements/Types/Shapes/PolygonGUIProps";


const makeProblem = (): Problem => {
    const startPoint: PointInfo = store.getState().startPoint!;
    const destinationPoint: PointInfo = store.getState().destinationPoint!;
    const polygons: Polygon[] = store.getState().polygons;

    store.dispatch( updateVisibilityMap(getVisibilityMap( polygons, startPoint, destinationPoint )) );

    return {
        initialState: {
            value: [ toVertex(startPoint!.coordinates), toVertex(startPoint!.coordinates) ],
        }, 

        actions: (state: State) : Action[] =>  {
            return store.getState().visibilityMap![ extractID(state.value[1]) ];
        },

        result: (state: State, vertex: Vertex): State => {
            return {
                value: [state.value[1], vertex]
            }
        },

        cost: (s: State, a: Action): number => Math.sqrt((s.value[1][0] - a[0])*(s.value[1][0] - a[0]) + (s.value[1][1] - a[1])*(s.value[1][1] - a[1])),

        goalTest: (state: State) => state.value[1][0] === destinationPoint.coordinates.x! && state.value[1][1] === destinationPoint.coordinates.y!,
    }
}

export const runAlgorithms = (selected: SelectedAlgorithms) => {
    const options: RunningOptions = store.getState().options;
    const problem: Problem = makeProblem();

    if( selected[Algorithms.BFS] ) {
        BFS(problem).then(
            (actions) => {
                store.dispatch(updateSolution(actions));
            }
        ).catch(
            () => console.log("No path between the given points")
        )
    } else 
        if( selected[Algorithms.DFS] )
            DFS(problem).then(
                (solution: Action[] | undefined ) =>  store.dispatch( updateSolution(solution as Action[]) )
            ).catch(
                () => console.log("No path between the given points")
            )
        else
            if( selected[Algorithms.ID] )
                ID( problem ).then(
                    (solution: Action[] | false) =>  store.dispatch( updateSolution(solution as Vertex[]) )
                ).catch(
                    () => console.log("No path between the given points")
                ) 
                else
                    if( selected[Algorithms.UC] )
                        UniformCost( problem ).then(
                            ( solution: Action[] | null ) => store.dispatch( updateSolution(solution as Vertex[]) )
                        ).catch(
                            ()=> console.log("No path between the given points")
                        )
                        else
                            if( selected[Algorithms.AStart] )
                                AStar( problem ).then(
                                    ( solution: Action[] | null ) => store.dispatch( updateSolution(solution as Vertex[]) )
                                ).catch(
                                    ()=> console.log("No path between the given points")
                                )


}