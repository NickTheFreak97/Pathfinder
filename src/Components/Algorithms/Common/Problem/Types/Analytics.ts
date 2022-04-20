export interface Analytics {
    generatedNodes: number,
    solutionDepth: number,
    branchingFactor: number, 
}

export const makeEmptyAnalytics = ():Analytics => {
    return {
        generatedNodes: 0,
        solutionDepth: 0,
        branchingFactor: 0,
    }
}