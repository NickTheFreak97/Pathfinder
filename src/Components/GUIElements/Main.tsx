import React, { useRef, useEffect, useState } from 'react';
import { Container } from '@mantine/core';

import Canva from './Canva';
import Legend from './Legend';


const Main = ()=>{
    const containerRef = useRef<HTMLDivElement>(null);
    const [theWidth, setTheWidth] = useState<number | undefined>(-1);
    const [theHeight, setTheHeight] = useState<number | undefined>(-1);

    useEffect(()=>{
        setTheWidth(containerRef?.current?.clientWidth);
        setTheHeight(containerRef?.current?.clientHeight);
    }, []);

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
            <Canva width={theWidth} height={theHeight}/>
            <Legend />
        </Container>
    )
}

export default Main;