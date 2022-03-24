/**
 * An implementation of Gauss' method with partial pivoting for solving linear system of equations
 * based on "Elementi di calcolo numerico: metodi e algoritmi" - M. G. Gasparo, R. Morandi, pp.78, 88
 * and adapted for the 2x2 case.
 */
export type Matrix2x2 = {
    0: [number, number], 
    1: [number, number]
} & Array< Array<number> >

export type ColumnVector2x1 = [number, number];

interface reductionResult {
    switches: [number, number],
    aik: [number, number],
    reducedMatrix: Matrix2x2
} 

const switchMatrix = ( matrix: Matrix2x2, r: number, c: number ) : Matrix2x2 => {
    for( let k: number =0; k < matrix[0].length; k++ ) {
        const tmp : number = matrix[r][k];
        matrix[r][k] = matrix[c][k];
        matrix[c][k] = tmp;
    }

    return matrix;
}

const findBiggestMultiplier = ( matrix: Matrix2x2, k: number ) : number => {
    let maximum = matrix[k][k];
    let maxIdx = k;

    for( let i: number =k+1; i < matrix.length; i++ )
        if( maximum < matrix[i][k] ) {
            maximum = matrix[i][k];
            maxIdx = i;
        }
    
    return maxIdx;
}

const gaussPartialPivot = ( matrix: Matrix2x2 ) : reductionResult | null => {
    let switches : [number, number] = [-1, -1];
    let aikSeq: [number, number] = [-1, -1];

    for( let k: number = 0; k < matrix.length-1; k++  ) {
        const r = findBiggestMultiplier(matrix, k);
        
        if( matrix[r][k] === 0 )
            return null;

        switches[k] = r;
        matrix = switchMatrix(matrix, r, k);

        for( let i: number = k+1; i < matrix.length; i++ ) {
            const aik : number = matrix[i][k]/matrix[k][k];
            aikSeq[i] = aik;
            for( let j: number = k+1; j < matrix.length; j++ )
                matrix[i][j] = matrix[i][j]-aik*matrix[k][j]
        }

    }

    if( matrix[matrix.length-1][matrix.length-1] === 0 )
        return null;
    else
        return {
            aik: aikSeq,
            switches,
            reducedMatrix: matrix
        };
}

const gaussSolve = ( b: ColumnVector2x1, switches: [number, number], aikSeq: [number, number] ) : ColumnVector2x1 => {
    for( let k: number = 0; k < b.length-1; k++ ) {
        let tmp : number = b[switches[k]];
        b[switches[k]] = b[k];
        b[k] = tmp;

        for( let i: number = k+1; i < b.length; i++ )
            b[i] = b[i] - aikSeq[i]*b[k];
    }   

    return b;
}

const triangularMatrixSolver = (redMatrix: Matrix2x2, b: ColumnVector2x1) : ColumnVector2x1 => {
    const x2: number = b[1]/redMatrix[redMatrix.length-1][redMatrix.length-1];
    const x1: number = (b[0]- redMatrix[0][1]*x2)/redMatrix[0][0];

    return [x1, x2];
}

export const solve2x2System = ( matrix: Matrix2x2, b: [number, number] ) : [number, number] | null => {
    const rr : reductionResult | null = gaussPartialPivot(matrix);
    if( !!rr ) {
        const result : ColumnVector2x1 = gaussSolve( [...b], rr.switches, rr.aik );
        return triangularMatrixSolver(rr.reducedMatrix, result);
    } else 
        return null;
}
