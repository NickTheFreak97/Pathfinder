import Big from "big.js"

export const computePolynomial = ( coefficients: Big[], x: Big ): Big => {
    
    let result: Big = coefficients[0];
    for( let i: number = 1; i < coefficients.length; i++ )
        result = result.mul(x).add(coefficients[i])

    return result;
}

export const EBFPolynomial = ( deg: number, c: number | Big, x: number | Big ): Big => {
    const coefficients: Big[] = [];
    for( let i:number = 0; i < deg; i++ )
        coefficients.push(Big(1));

    coefficients.push(Big(c));
    return computePolynomial( coefficients, Big(x) );
}

export const EBFPolynomialDerivative = ( deg: number, x: number | Big ): Big => {
    const coefficients: Big[] = [];
    for( let i:number = deg; i >= 1; i-- )
        coefficients.push(Big(i));

    return computePolynomial( coefficients, Big(x) );
}

export const findRoot = ( depth: number, generatedNodes: number ): number => {
    let x: Big = Big(1);
    const MAX_STEPS: number = 50;
    const tollerance: Big = Big( Number.EPSILON ).sqrt();

    for( let i: number = 0; i < MAX_STEPS; i++ ) {
        
        let y: Big = EBFPolynomial(depth, -1*generatedNodes, x);
        if( y.abs().lt( tollerance ) )
            break;
        
        let d: Big = EBFPolynomialDerivative( depth, x ); 
        x = x.sub( y.div(d) );
        
    }

    return x.toNumber();
}