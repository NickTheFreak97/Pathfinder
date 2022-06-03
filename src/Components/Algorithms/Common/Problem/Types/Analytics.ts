import { State } from "../../../../GUIElements/Types/Redux/State"
import { Polygon } from "../../../../GUIElements/Types/Shapes/Polygon"
import { store } from "../../../../Redux/Store/store"
import { computeBranchingFactor } from "../../Analytics/BranchingFactor"
import { findRoot } from "../../Analytics/Utils/Newton"

export interface Analytics {
    generatedNodes: number,
    solutionDepth: number,
    branchingFactor: number, 
    EBF?: number,
    cost: number,
    memory: number,
    completionTime: number,
    algorithmName: string,
    polygonCount: number,
    maxVertices: number, 
    avgVertices: number, 
    frontierSize: number,
    exploredSize: number,
}

export const makeEmptyAnalytics = (algorithmName?: string) : Analytics => {
    return {
        generatedNodes: 0,
        solutionDepth: 0,
        branchingFactor: 0,
        memory: 0,
        completionTime: 0,
        algorithmName: algorithmName || "",
        EBF: undefined,
        polygonCount: -1,
        maxVertices: -1,
        cost: -1,
        avgVertices: -1,
        frontierSize: -1,
        exploredSize: -1,
    }
}

export const autoComputeAnalytics = (analytics: Analytics, solutionDepth: number, computeEBF: boolean): void  => {
    const state: () => State = store.getState;

    console.log("Autocomputing analytics");

    analytics.frontierSize = state().frontier!.size();
    analytics.exploredSize = Object.keys(state().frontier!).length;
    analytics.polygonCount = state().polygons.length;

    let maxVertices = 0;
    let verticesCnt = 0;
    state().polygons.forEach(
        (p: Polygon) => {
            const vertices = p.vertices.length;
            if( vertices > maxVertices )
                maxVertices = vertices;
            verticesCnt += vertices;
        }
    );

    analytics.maxVertices = maxVertices;
    analytics.avgVertices = verticesCnt/state().polygons.length;
    analytics.solutionDepth = solutionDepth-1;
    analytics.branchingFactor = computeBranchingFactor();
    
    if( computeEBF )
        analytics.EBF = findRoot(solutionDepth-1, analytics.frontierSize+analytics.exploredSize+1);
    else
        analytics.EBF = -1;

}