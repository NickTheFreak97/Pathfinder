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
import { SolutionAndLog } from "../../Algorithms/Common/Problem/Types/ResultAndLog";
import { updateAnalytics } from "../../Algorithms/Common/Analytics/Utils/UpdateAnalytics";
import { makeEmptyAnalytics } from "../../Algorithms/Common/Problem/Types/Analytics";
import { setFrontier } from "../SetDataStructures/setFrontier";
import { setExplored } from "../SetDataStructures/setExplored";


const makeProblem = (): Problem => {
    const startPoint: PointInfo = store.getState().startPoint!;
    const destinationPoint: PointInfo = store.getState().destinationPoint!;
    const polygons: Polygon[] = store.getState().polygons;

    if( !store.getState().visibilityMap )
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

    store.dispatch(updateSolution(null));
    store.dispatch(setFrontier(null));
    store.dispatch(setExplored(null));
    store.dispatch(updateAnalytics(makeEmptyAnalytics(), -1));
    store.dispatch(updateVisibilityMap(getVisibilityMap(store.getState().polygons, store.getState().startPoint, store.getState().destinationPoint)))

    if( selected[Algorithms.BFS] ) {
        const startTime: number = Date.now();
        BFS(problem, options.computeEBF).then(
            (solution: SolutionAndLog | undefined) => {
                store.dispatch(updateSolution(solution?.solution));
                const endTime: number = Date.now();
                store.dispatch( updateAnalytics(solution!.log!, endTime-startTime ) )
            }
        ).catch(
            () => console.log("No path between the given points")
        )
    } else 
        if( selected[Algorithms.DFS] ) {
            const startTime: number = Date.now();
            DFS(problem, options.computeEBF).then(
                (solution: SolutionAndLog | undefined ) => {
                    const endTime: number = Date.now();
                    store.dispatch( updateSolution(solution?.solution as Action[]) )
                    store.dispatch( updateAnalytics( solution!.log!, endTime-startTime ) );
                }
            ).catch(
                () => console.log("No path between the given points")
            )
        }
        else
            if( selected[Algorithms.ID] ) {
                const startTime: number = Date.now();
                ID( problem, options.computeEBF ).then(
                    (report: SolutionAndLog | false) => {
                        const endTime: number = Date.now();
                        store.dispatch( updateSolution((report as SolutionAndLog).solution! as Vertex[]) );
                        store.dispatch( updateAnalytics((report as SolutionAndLog).log!, endTime-startTime) )
                    }
                ).catch(
                    () => console.log("No path between the given points")
                ) 
            }
                else
                    if( selected[Algorithms.UC] ){
                        const startTime: number = Date.now();
                        UniformCost( problem, options.computeEBF ).then(
                            ( report: SolutionAndLog | null ) => {
                                const endTime: number = Date.now();
                                store.dispatch( updateSolution(report!.solution as Vertex[]) )
                                store.dispatch( updateAnalytics(report!.log!, endTime-startTime ) )
                            }
                        ).catch(
                            ()=> console.log("No path between the given points")
                        )
                    }
                        else
                            if( selected[Algorithms.AStart] ) {
                                const startTime = Date.now();
                                AStar( problem, options.computeEBF ).then(
                                    ( report: SolutionAndLog | null ) => {
                                        const endTime = Date.now();
                                        store.dispatch( updateSolution(report!.solution as Vertex[]) );
                                        store.dispatch( updateAnalytics( report!.log || makeEmptyAnalytics(), endTime - startTime ) );
                                    }
                                ).catch(
                                    ()=> console.log("No path between the given points")
                                )
                            }


}