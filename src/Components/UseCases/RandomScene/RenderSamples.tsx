import React, {useState, useEffect} from 'react';
import { KDTree } from 'mnemonist';
import Point from '../../GUIElements/Shapes/Point';
import PoissonDiskSampling from 'poisson-disk-sampling';
import { extractID } from '../../Algorithms/Common/VisibilityMap/VisibilityMap';
import { extractPoint } from '../../Algorithms/Common/VisibilityMap/VisibilityMap';
import { Vertex } from '../../GUIElements/Types/Shapes/PolygonGUIProps';
import { Circle, Line } from 'react-konva';

interface RenderSamplesProps {
    height?: number,
    width?: number,
    minDistance?: number,
    samplesCnt: number,
    maxVertices: number,
    forceMax?: boolean,
}

const RenderSamples : React.FC<RenderSamplesProps> = ({width, height, minDistance, samplesCnt, maxVertices, forceMax}) => {

    const [samples, setSamples] = useState<number[][] | undefined>(undefined);
    const [ptTree, setPtTree] = useState<KDTree<string> | undefined>(undefined);
    let maxGeneratedVertices = 3;

    useEffect(
        ()=>{
            if( width && height )
                setSamples( 
                    new PoissonDiskSampling({
                        shape: 
                            [
                                width-2*minDistance!, 
                                height-2*minDistance!
                            ],
                        minDistance: minDistance!,
                        tries: 30
                    })
                    .fill()
                    .sort(
                        ()=> Math.random()-Math.random()
                    )
                    .slice(0, samplesCnt)
                )
            
        }, [width, height, minDistance]
    )

    useEffect(
        ()=>{
            if( !!samples )
                setPtTree(
                    KDTree.from(
                        samples!.map(
                            pt => 
                                [extractID(pt as Vertex), pt]
                        ), 2
                    )
                )
        }, [samples]
    )

    return <>
        {
            (ptTree && samples) && 
            samples?.map(
                (sample, i) => {
                    const closestPtID: string = ptTree?.kNearestNeighbors(2,sample)[1];
                    if( !closestPtID )
                        return null;
                    
                    const closestPt: Vertex = extractPoint(closestPtID);
                    if( !closestPt )
                        return null;
                    
                    const d: number = 
                            Math.sqrt( 
                                (sample[0]-closestPt[0])*(sample[0]-closestPt[0]) +
                                (sample[1]-closestPt[1])*(sample[1]-closestPt[1])
                            )
                    
                    let radius: number = d/2;
                    let color = 'rgba(0,0,0,0.2)';

                    if( sample[0]+minDistance!-d/2 < 0! )
                        radius = sample[0]+minDistance!;
                    else
                        if( sample[0]+minDistance!+d/2 > width! )
                            radius = width!-minDistance!-sample[0];

                    if( sample[1]+minDistance!-d/2 < 0 )
                        radius = Math.min( radius, sample[1]+minDistance! );
                    else 
                        if( sample[1]+minDistance!+d/2 > height!)
                            radius = Math.min( radius, height!-minDistance!-sample[1] );

                    const polyRadius = Math.random()*(radius-10)+10;
                    
                    let polygonVerticesCnt: number =
                         Math.max(Math.floor(Math.random()*(maxVertices-2))+3, 3);

                    if( polygonVerticesCnt > maxGeneratedVertices )
                        maxGeneratedVertices = polygonVerticesCnt;
                    
                    if( i === samples.length-1 && forceMax && polygonVerticesCnt < maxVertices )
                        polygonVerticesCnt = maxVertices;

                    const angles: number[] = 
                        Array.from({length: 2*polygonVerticesCnt}, 
                            () => Math.random()*(2*Math.PI)
                        ).sort(
                            () => Math.random() - Math.random()
                        ).slice(0, polygonVerticesCnt)
                        .sort( (a, b) => b-a )
                        
                    return (
                        <React.Fragment key={`(${sample[0]},${sample[1]})`}>
                            {/* <Point
                                innerRadius={2}
                                outerRadius={6}
                                x={sample[0]+minDistance!}
                                y={sample[1]+minDistance!}
                                name={`(${sample[0]},${sample[1]})`}
                            /> */}
                            {
                                d &&
                                    <>
                                        {/* <Circle
                                            x={sample[0]+minDistance!}
                                            y={sample[1]+minDistance!}
                                            radius={radius}
                                            strokeWidth={1}
                                            stroke={
                                                color
                                            }
                                        />
                                        <Circle
                                            x={sample[0]+minDistance!}
                                            y={sample[1]+minDistance!}
                                            radius={polyRadius}
                                            strokeWidth={1}
                                            stroke={'#ff0043'}
                                        /> */}
                                        {
                                            angles.map(
                                                (angle, i, angles) => 
                                                <>
                                                    {/* <Point
                                                        x={sample[0]+minDistance!+ polyRadius*Math.cos(angle)}
                                                        y={sample[1]+minDistance!+ polyRadius*Math.sin(angle)}
                                                        innerRadius={2}
                                                        outerRadius={6}
                                                        outerFill={'transparent'}
                                                        name={''}                                                
                                                    /> */}
                                                    <Line
                                                        points={
                                                            [
                                                                sample[0]+minDistance!+ polyRadius*Math.cos(angle),
                                                                sample[1]+minDistance!+ polyRadius*Math.sin(angle),
                                                                sample[0]+minDistance!+ polyRadius*Math.cos(
                                                                    angles[(i+1)%angles.length]
                                                                ),
                                                                sample[1]+minDistance!+ polyRadius*Math.sin(
                                                                    angles[(i+1)%angles.length]
                                                                )
                                                            ]
                                                        }
                                                        stroke='blue'
                                                        strokeWidth={1}
                                                    />
                                                </>
                                            )
                                        }
                                    </>
                                    
                            }
                        </React.Fragment>
                    )
                }
            )
        }
    </>;
}

RenderSamples.defaultProps = {
    minDistance: 20,
}

export default RenderSamples;