export enum Algorithms {
    BFS = 'BFS',
    DFS = 'DFS',
    UC = 'UC',
    ID = 'ID',
    AStar = 'AStar',
}

export interface SelectedAlgorithms {
    [Algorithms.BFS]: boolean,
    [Algorithms.DFS]: boolean,
    [Algorithms.UC]: boolean,
    [Algorithms.ID]: boolean,
    [Algorithms.AStar]: boolean,
}

export const makeEmptySelectedAlgorithms = (): SelectedAlgorithms => {
    return {
        [Algorithms.BFS]: false,
        [Algorithms.DFS]: false,
        [Algorithms.UC]: false,
        [Algorithms.ID]: false,
        [Algorithms.AStar]: false,
    }
}