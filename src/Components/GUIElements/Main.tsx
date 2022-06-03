import React, { useRef, useEffect, useState, Dispatch } from 'react';
import { Container } from '@mantine/core';
import { connect } from 'react-redux';
import RenderLog from '../UseCases/RunAlgorithms/ViewSolution/RenderLog';
import { updateSceneRect } from '../UseCases/RandomScene/updateSceneRect';
import { SceneRect } from '../UseCases/RandomScene/updateSceneRect';
import Canva from './Canva';
import Legend from './Legend';
import { Action } from './Types/Redux/Action';

const mapDispatchToProps = (dispatch: Dispatch<Action>)  => {
    return {
        updateSceneRect: (rect: SceneRect) => dispatch(updateSceneRect(rect)),
    }
}

interface MainProps {
    updateSceneRect: (rect: SceneRect) => void
}

const Main: React.FC<MainProps> = ({updateSceneRect})=>{
    const containerRef = useRef<HTMLDivElement>(null);
    const [theWidth, setTheWidth] = useState<number | undefined>(-1);
    const [theHeight, setTheHeight] = useState<number | undefined>(-1);

    useEffect(()=>{
        setTheWidth(containerRef?.current?.clientWidth);
        setTheHeight(containerRef?.current?.clientHeight);
    }, []);

    useEffect(
        ()=>{
            if( theHeight && theWidth )
                if( theWidth > 0 && theHeight > 0 )
                    updateSceneRect({
                        width: theWidth,
                        height: theHeight,
                    })

        }, [theWidth, theHeight]
    )

    return (
        <Container
            ref={containerRef}
            style={{
                height: "calc(100% - 32px)",
                backgroundColor: "#F5F5F5",
                margin: 0,
                padding: 0,
                maxWidth: "none",
            }}
        >
            <RenderLog />
            <Canva width={theWidth} height={theHeight}/>
            <Legend />
        </Container>
    )
}

export default connect(null, mapDispatchToProps)(Main);