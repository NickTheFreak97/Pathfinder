import { typeSizes } from "../../UseCases/MonitorPerformance/MemoryUsage";

test('Correctly estimating size of simple objects', ()=>{
    const sampleObject: any = {
        "name": "Niccolo",
        "age": 24, 
        "graduated": false,
    }

    expect(typeSizes.object(sampleObject)).toBe(58);
} )

test('Correctly estimating size of object containing arrays', ()=>{
    const sampleObject: any = {
        "name": "Niccolo",
        "age": 24, 
        "graduated": false,
        "friends": ["Matteo", "Niccolò", "Adrian"]
    }

    expect(typeSizes.object(["Matteo", "Niccolò", "Adrian"])).toBe(38);
    expect(typeSizes.object(sampleObject)).toBe(110);
} )

test('Correctly estimating size of object containing sub-objects', ()=>{
    const sampleObject: any = {
        name: "Niccolo",
        age: 24, 
        graduated: false,
        mother: {
            name:"Lucia",
            age: 56,
            graduated: false 
        }
    }

    expect(typeSizes.object(sampleObject)).toBe(124);
})

test('Correctly estimating size of objects containing array of objects', ()=>{
    const sampleObject: any = {
        name: "Niccolo",
        age: 24, 
        graduated: false,
        friends: [
            {
                name:"Matteo",
                age: 24,
                graduated: true, 
            }, 
            {
                name:"Niccolò",
                age: 26,
                graduated: false, 
            }, 
            {
                name:"Adrian",
                age: 31,
                graduated: false, 
            },
        ]
    }

    expect( typeSizes.object(sampleObject) ).toBe(242);
})