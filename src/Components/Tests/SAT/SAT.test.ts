import { v4 as uuidv4 } from "uuid";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { SATCollisionTest } from "../../UseCases/CollisionDetection/SAT";
import { ThreeOrMoreVertices } from "../../GUIElements/Types/Shapes/PolygonGUIProps";
import { Vector2D } from "../../UseCases/CollisionDetection/Utils/Vector2D";
import { getSides } from "../../UseCases/CollisionDetection/Utils/SATUtils";
import Big from "big.js";

test('Vector is properly normalized', ()=>{
  const testVector: Vector2D = new Vector2D(3,4);
  expect(testVector.normalize()!.length().eq(1)).toBe(true);
})

test('Vector normal is properly obtained', ()=>{
  const testVector: Vector2D = new Vector2D(3,4);
  expect( testVector.normal()?.compare(new Vector2D(4,-3))).toBe(true);
  expect( testVector.normal()?.compare(new Vector2D(4,-3+2*Math.sqrt(Number.EPSILON)))).toBe(false);
})

test('Side projection onto axis is correctly computed', ()=>{
  const axis: Vector2D = new Vector2D(0,1).normal()?.normalize()!;
  const testVector: Vector2D = new Vector2D(3, 5);
  const projection: Big = testVector.projectOnto(axis);

  const axisB: Vector2D = new Vector2D(Math.sqrt(2),Math.sqrt(2)).normalize()!;
  const projectionB:Big = testVector.projectOnto(axisB);
  const projectionBReverse:Big = axisB.projectOnto(testVector);

  expect(projection.eq(3)).toBe(true)
  expect(projectionB.eq( new Big(2).sqrt().times(4) )).toBe(true);
  expect(projectionBReverse.eq(projectionB)).toBe(true);
})

test('Polygon sides are correctly generated', ()=>{
  const triangle: Polygon = {
    id: uuidv4(),
    vertices: [
      [670,324],
      [719,184],
      [759,357],   
    ], 

    transformedVertices: [
      [670,324],
      [719,184],
      [759,357],   
    ], 
  }

  const sides: Vector2D[] = getSides(triangle);
  expect(sides[0].compare(new Vector2D(49,-140))).toBe(true);
  expect(sides[1].compare(new Vector2D(40, 173))).toBe(true);
  expect(sides[2].compare(new Vector2D(-89, -33))).toBe(true);

})

test('Collision is properly detected', ()=>{
    const polyA: Polygon = {
        id: uuidv4(),
        vertices: [
          [4, 3],
          [6, 7],
          [8, 2],
      ] as ThreeOrMoreVertices,
        transformedVertices: [
          [4, 3],
          [6, 7],
          [8, 2],
      ] as ThreeOrMoreVertices,
        isConvex: true,
      };
      
      const polyB: Polygon = {
        id: uuidv4(),
        vertices: [
          [8, 5],
          [9, 9],
          [12, 7]
      ],
        transformedVertices: [
          [8, 5],
          [9, 9],
          [12, 7]
        ],
      };

      const polyC: Polygon = {
        id: uuidv4(),
        vertices: [
          [7, 3],
          [8, 8],
          [11, 5]
      ],
        transformedVertices: [
          [7, 3],
          [8, 8],
          [11, 5]
        ],
      };
      
      expect(SATCollisionTest(polyA, polyB)).toBe(false);
      expect(SATCollisionTest(polyA, polyC)).toBe(true);
    })
