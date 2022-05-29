import { Polygon } from "../Shapes/Polygon";
import { InteractionMode } from "../../../Utils/interactionMode";
import { Vertex } from "../Shapes/PolygonGUIProps";
import { PointInfo } from "../Shapes/PointInfo";
import { Explored, Frontier } from "../../../Algorithms/Common/Problem/Types/Problem";
import { RunningOptions } from "../../../UseCases/RunAlgorithms/Types/RunningOptions";
import { VisibilityMap } from "../../../Algorithms/Common/VisibilityMap/VisibilityMap";
import { Action } from "../../../Algorithms/Common/Problem/Types/Action";
import { AABBTree } from "../../../Utils/AABBTree/aabbtree";
import { Analytics } from "../../../Algorithms/Common/Problem/Types/Analytics";
import { RandomPolyCircleItem } from "../../../UseCases/RandomScene/addRandonPolygonCircle";

export interface State {
    polygons: Polygon[],
    useMode: InteractionMode,
    currentPoint: Vertex | null | undefined,
    newPolygonVertices: Vertex [],
    selectedPolygonID: string | null | undefined,
    startPoint: PointInfo | null | undefined,
    destinationPoint: PointInfo | null | undefined,

    frontier: Frontier | null | undefined,
    explored: Explored | null | undefined,
    options: RunningOptions,
    visibilityMap: VisibilityMap | null | undefined,
    solution: Action[] | null | undefined,
    solutionAnalytics: Analytics
    AABBTree: AABBTree,

    sceneRect: {
        width: number, 
        height: number,
    }
    
    randomPolyCircles: {
        [key: string]: RandomPolyCircleItem
    }
}