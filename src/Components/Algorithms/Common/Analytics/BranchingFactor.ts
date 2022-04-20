import { store } from "../../../Redux/Store/store";
import { VisibilityMap } from "../VisibilityMap/VisibilityMap";

export const computeBranchingFactor = (): number => {
    const vMap: VisibilityMap = store.getState().visibilityMap!;
            
    return Math.max.apply(
        Math, 
        Object.keys(vMap).map( (ptID: string): number => vMap[ptID].length )
    )
}