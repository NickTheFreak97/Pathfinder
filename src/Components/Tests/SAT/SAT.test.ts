import { v4 as uuidv4 } from "uuid";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { SATCollisionTest } from "../../UseCases/CollisionDetection/SAT";
import { getNormals } from "../../UseCases/CollisionDetection/Utils/SATUtils";
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

test('Parallel axes aren\'t repeated', ()=>{
  const rectangle: Polygon = {
    id: uuidv4(),

    vertices: [
      [0, 0],
      [0, 1],
      [1, 2],
      [0, 2]
    ], 

    transformedVertices: [
      [0, 0],
      [1, 0],
      [1, 2],
      [0, 2]
    ]
  }

  const axes: Vector2D[] = getNormals(rectangle);
  expect(axes.length).toBe(2);
  
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

test('Collision between complex polygons', ()=>{
  const polyA: Polygon = {
    id: "9550420f-e588-4f1b-860c-053274d7f5c8",
    vertices: [
      [225, 43],
      [274, 54],
      [288, 71],
      [297, 125],
      [294, 148],
      [277, 171],
      [258, 189],
      [230, 199],
      [194, 198],
      [156, 181],
      [138, 161],
      [128, 134],
      [134, 103],
      [143, 83],
      [170, 60],
      [198, 50],
    ],
    transformedVertices: [
      [225, 43],
      [274, 54],
      [288, 71],
      [297, 125],
      [294, 148],
      [277, 171],
      [258, 189],
      [230, 199],
      [194, 198],
      [156, 181],
      [138, 161],
      [128, 134],
      [134, 103],
      [143, 83],
      [170, 60],
      [198, 50],
    ],
  };

  const polyB: Polygon = {
    id: "dc351682-2748-4ac4-bba0-9a1f8a9382ce",
    vertices: [
      [686, 98],
      [697, 101],
      [736, 122],
      [746, 135],
      [755, 152],
      [754, 175],
      [745, 199],
      [735, 218],
      [706, 243],
      [676, 251],
      [625, 248],
      [587, 229],
      [559, 193],
      [555, 155],
      [576, 120],
      [601, 99],
      [638, 97],
    ],
    transformedVertices: [
      [377, 145],
      [388, 148],
      [427, 169],
      [437, 182],
      [446, 199],
      [445, 222],
      [436, 246],
      [426, 265],
      [397, 290],
      [367, 298],
      [316, 295],
      [278, 276],
      [250, 240],
      [246, 202],
      [267, 167],
      [292, 146],
      [329, 144],
    ]
  };

  const polyC: Polygon = {
    id: "dc351682-2748-4ac4-bba0-9a1f8a9382ce",
    vertices: [
      [686, 98],
      [697, 101],
      [736, 122],
      [746, 135],
      [755, 152],
      [754, 175],
      [745, 199],
      [735, 218],
      [706, 243],
      [676, 251],
      [625, 248],
      [587, 229],
      [559, 193],
      [555, 155],
      [576, 120],
      [601, 99],
      [638, 97],
    ],
    transformedVertices: [
      [686, 98],
      [697, 101],
      [736, 122],
      [746, 135],
      [755, 152],
      [754, 175],
      [745, 199],
      [735, 218],
      [706, 243],
      [676, 251],
      [625, 248],
      [587, 229],
      [559, 193],
      [555, 155],
      [576, 120],
      [601, 99],
      [638, 97],
    ]
  }

  expect(SATCollisionTest(polyA, polyB)).toBe(true);
  expect(SATCollisionTest(polyA, polyC)).toBe(false);
})