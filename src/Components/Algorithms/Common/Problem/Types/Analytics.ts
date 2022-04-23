export interface Analytics {
    generatedNodes: number,
    solutionDepth: number,
    branchingFactor: number, 
    memory: number,
    completionTime: number,
}

export const makeEmptyAnalytics = ():Analytics => {
    return {
        generatedNodes: 0,
        solutionDepth: 0,
        branchingFactor: 0,
        memory: 0,
        completionTime: 0,
    }
}