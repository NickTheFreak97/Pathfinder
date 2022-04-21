import Big from "big.js";
import { computePolynomial, EBFPolynomial, EBFPolynomialDerivative, findRoot } from "../../Algorithms/Common/Analytics/Utils/Newton";

test('Horner\'s method test', ()=>{
    const res: Big = computePolynomial([Big(2), Big(-6), Big(2), Big(-1)], Big(3));
    expect(res.eq(5)).toBe(true)
} )

test('Effective branching factor definition\'s polynomial', ()=>{
    const res: Big = EBFPolynomial(4, -16, 2);
    expect(res.eq(14)).toBe(true);
} )

test('Effective branching factor definition\'s polynomial\'s derivative', ()=>{
    const res: Big = EBFPolynomialDerivative(4, 2);
    expect(res.eq(49)).toBe(true);
} )

test('Newton\'s method for finding roots', ()=>{
    expect( findRoot(4, 16).toFixed(4) ).toBe("1.6408");
})