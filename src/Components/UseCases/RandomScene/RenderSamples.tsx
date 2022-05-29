import React, {useState, useEffect} from 'react';
import { KDTree } from 'mnemonist';
import Point from '../../GUIElements/Shapes/Point';
import PoissonDiskSampling from 'poisson-disk-sampling';
import { extractID } from '../../Algorithms/Common/VisibilityMap/VisibilityMap';
import { extractPoint } from '../../Algorithms/Common/VisibilityMap/VisibilityMap';
import { Vertex } from '../../GUIElements/Types/Shapes/PolygonGUIProps';
import { Circle } from 'react-konva';

interface RenderSamplesProps {
    height?: number,
    width?: number,
    minRadius?: number,
    samplesCnt: number,
}

const RenderSamples : React.FC<RenderSamplesProps> = ({width, height, minRadius, samplesCnt}) => {

    const [samples, setSamples] = useState<number[][] | undefined>(undefined);
    const [ptTree, setPtTree] = useState<KDTree<string> | undefined>(undefined);

    useEffect(
        ()=>{
            if( width && height )
                setSamples( 
                    new PoissonDiskSampling({
                        shape: 
                            [
                                width-2*minRadius!, 
                                height-2*minRadius!
                            ],
                        minDistance: minRadius!,
                        tries: 10
                    })
                    .fill()
                    .sort(
                        ()=> Math.random()-Math.random()
                    )
                    .slice(0, samplesCnt)
                )
            
        }, [width, height, minRadius]
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
            samples?.map(
                sample => {
                    const closestPtID: string | undefined = ptTree?.kNearestNeighbors(2,sample)[1];
                    const closestPt: Vertex | undefined = closestPtID ? extractPoint(closestPtID) : undefined;
                    
                    const d: number | undefined = 
                        closestPt ? 
                            Math.sqrt( 
                                (sample[0]-closestPt[0])*(sample[0]-closestPt[0]) +
                                (sample[1]-closestPt[1])*(sample[1]-closestPt[1])
                            ) : undefined


                    console.log("ptID, pt, d", closestPtID, closestPt, d);
                    
                    return (
                        <React.Fragment key={`(${sample[0]},${sample[1]})`}>
                            <Point
                                innerRadius={2}
                                outerRadius={6}
                                x={sample[0]+minRadius!}
                                y={sample[1]+minRadius!}
                                name={`(${sample[0]},${sample[1]})`}
                            />
                            {
                                d &&
                                    <Circle
                                        x={sample[0]+minRadius!}
                                        y={sample[1]+minRadius!}
                                        radius={minRadius!/2}
                                        strokeWidth={1}
                                        stroke={'rgba(0,0,0,0.2)'}
                                    />
                            }
                        </React.Fragment>
                    )
                }
            )
        }
    </>;
}

RenderSamples.defaultProps = {
    minRadius: 30,
}

export default RenderSamples;