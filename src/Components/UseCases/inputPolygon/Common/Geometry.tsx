import { solve2x2System, Matrix2x2, ColumnVector2x1 } from "./SystemSolver";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";

export type Segment = [Vertex, Vertex];

const doIntervalsOverlap = (
  rangeA: [number, number],
  rangeB: [number, number]
): boolean => {
  return !(
    Math.min(rangeB[0], rangeB[1]) > Math.max(rangeA[0], rangeA[1]) ||
    Math.min(rangeA[0], rangeA[1]) > Math.max(rangeB[0], rangeB[1])
  );
};

export const doSegmentsIntersect = (
  segmA: Segment,
  segmB: Segment
): boolean => {
  const A: Matrix2x2 = [
    [segmA[0][0] - segmA[1][0], segmB[1][0] - segmB[0][0]],
    [segmA[0][1] - segmA[1][1], segmB[1][1] - segmB[0][1]],
  ];

  const b: ColumnVector2x1 = [
    segmB[1][0] - segmA[1][0],
    segmB[1][1] - segmA[1][1],
  ];

  if (
    (A[0][0] === A[0][1] && A[0][1] === b[0] && b[0] === 0) ||
    (A[1][0] === A[1][1] && A[1][1] === b[1] && b[1] === 0)
  ) {
    const xProjectionS1: [number, number] = [segmA[0][0], segmA[1][0]]; // [Xa, Xb]
    const yProjectionS1: [number, number] = [segmA[0][1], segmA[1][1]]; // [Ya, Yb]

    const xProjectionS2: [number, number] = [segmB[0][0], segmB[1][0]]; // [Xc, Xd]
    const yProjectionS2: [number, number] = [segmB[0][1], segmB[1][1]]; // [Yc, Yd]

    if (
      xProjectionS1[1] === xProjectionS1[0] ||
      xProjectionS2[1] === xProjectionS2[0]
    )
      return doIntervalsOverlap(yProjectionS1, yProjectionS2);
    else if (
      yProjectionS1[1] === yProjectionS1[0] ||
      yProjectionS2[1] === yProjectionS2[0]
    )
      return doIntervalsOverlap(xProjectionS1, xProjectionS2);
    else
      return (
        doIntervalsOverlap(xProjectionS1, xProjectionS2) ||
        doIntervalsOverlap(yProjectionS1, yProjectionS2)
      );
  }

  const intersection: [number, number] | null = solve2x2System(A, b);

  if (!!intersection)
    return (
      intersection[0] >= 0 &&
      intersection[0] <= 1 &&
      intersection[1] >= 0 &&
      intersection[1] <= 1
    );
  else return false;
};
