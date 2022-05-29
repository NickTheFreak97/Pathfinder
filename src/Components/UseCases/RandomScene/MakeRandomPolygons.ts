import PoissonDiskSampling from 'poisson-disk-sampling';
import { KDTree } from 'mnemonist';
import { v4 as uuidv4 } from 'uuid';

import { addPolygon } from '../InputPolygon/Actions/addPolygon';
import { extractID } from '../../Algorithms/Common/VisibilityMap/VisibilityMap';
import { extractPoint } from '../../Algorithms/Common/VisibilityMap/VisibilityMap';
import { Vertex } from '../../GUIElements/Types/Shapes/PolygonGUIProps';
import { ThreeOrMoreVertices } from '../../GUIElements/Types/Shapes/PolygonGUIProps';
import { Dispatch } from 'react';
import { Action } from '../../GUIElements/Types/Redux/Action';
import { State } from '../../GUIElements/Types/Redux/State';
import { addRandomPolyCircle } from './addRandonPolygonCircle';

export interface RandomSceneProps {
    polyCount: number,
    minCircumcenterDist: number,
    maxVertices: number,
    forceMax?: boolean,
}

export const makeRandomScene = (props: RandomSceneProps) => (dispatch: Dispatch<Action>, state: () => State ) => {
    const { polyCount, minCircumcenterDist } = props;
    const { width, height } = state().sceneRect;
    
    const samples: number[][] = 
        new PoissonDiskSampling({
            shape: 
                [
                    width-2*minCircumcenterDist, 
                    height*0.75-2*minCircumcenterDist
                ],
            minDistance: minCircumcenterDist,
            tries: 30
        })
        .fill()
        .sort(
            ()=> Math.random()-Math.random()
        )
        .slice(0, polyCount)
    
    const ptTree: KDTree<string> =
        KDTree.from(
            samples.map(
                pt => 
                    [extractID(pt as Vertex), pt]
            ), 2
    ); 

    const points: PolygonInfo[] = makePoints(samples, ptTree, width, height, props, dispatch);
    points.forEach(
        polygonPts => {
            dispatch(
                addPolygon({
                    vertices: polygonPts.vertices as ThreeOrMoreVertices,
                    transformedVertices: polygonPts.vertices as ThreeOrMoreVertices,
                    id: uuidv4(),
                    overlappingPolygonsID: [],
                    isConvex: true,
                    isRandom: true,
                })
            )
        }
    )

}

interface PolygonInfo {
    id: string, 
    vertices: number[][],
}

const makePoints = (samples: number[][], tree: KDTree<string>, width: number, height: number, props: RandomSceneProps, dispatch: Dispatch<Action> ): PolygonInfo[] => {
    const { minCircumcenterDist, maxVertices, forceMax } = props;
    let maxGeneratedVertices = 0;
    return samples.map(
        (sample, i) => {
            const polygonID: string = uuidv4();
            const closestPtID: string = tree!.kNearestNeighbors(2,sample)[1];
            const closestPt: Vertex = extractPoint(closestPtID);            
            const d: number = 
                    Math.sqrt( 
                        (sample[0]-closestPt[0])*(sample[0]-closestPt[0]) +
                        (sample[1]-closestPt[1])*(sample[1]-closestPt[1])
                    )

            const radius = adjustRadius(sample, d, width, height, props);
            const innerR = Math.random()*(radius-10)+10;

            let polygonVerticesCnt: number =
            Math.max(Math.floor(Math.random()*(maxVertices-2))+3, 3);

            if( polygonVerticesCnt > maxGeneratedVertices )
                maxGeneratedVertices = polygonVerticesCnt;
            
            if( i === samples.length-1 && forceMax && polygonVerticesCnt < maxVertices )
                polygonVerticesCnt = maxVertices;
            
            dispatch(
                addRandomPolyCircle({
                    circumCenter: [sample[0]+minCircumcenterDist, sample[1]+minCircumcenterDist] as Vertex,
                    outerRadius: radius, 
                    innerRadius: innerR,
                    id: polygonID,
                })
            )

            const angles = generateAngles(polygonVerticesCnt);
            return {
                id: polygonID,
                vertices: makePointsFromAngles([sample[0]+minCircumcenterDist, sample[1]+minCircumcenterDist], innerR, angles)
            }
        }
    )
}

const adjustRadius = (sample: number[], d: number, width:number, height:number, props: RandomSceneProps): number => {
    const { minCircumcenterDist } = props;
    let radius: number = d/2;

    if( sample[0]+minCircumcenterDist-d/2 < 0 )
        radius = sample[0]+minCircumcenterDist;
    else
        if( sample[0]+minCircumcenterDist+d/2 > width! )
            radius = width-minCircumcenterDist-sample[0];

    if( sample[1]+minCircumcenterDist-d/2 < 0 )
        radius = Math.min( radius, sample[1]+minCircumcenterDist );
    else 
        if( sample[1]+minCircumcenterDist+d/2 > height*0.75)
            radius = Math.min( radius, height*0.75-minCircumcenterDist-sample[1] );

    return radius;
}

const generateAngles = (angles: number): number[] => {
    return (
        Array.from({length: 2*angles}, 
            () => Math.random()*(2*Math.PI)
        ).sort(
            () => Math.random() - Math.random()
        ).slice(0, angles)
        .sort( (a, b) => b-a )
    )
}

const makePointsFromAngles = (circumCenter: number[], radius: number, angles: number[]): number[][] => {
    return angles.map(
        angle => 
            [
                circumCenter[0]+radius*Math.cos(angle),
                circumCenter[1]+radius*Math.sin(angle),
            ]
    )
}