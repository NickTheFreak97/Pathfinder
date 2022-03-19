import React, { useRef, useEffect, useState } from 'react';
import { Container } from '@mantine/core';

import Canva from './Canva';


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
            fluid
            ref={containerRef}
            sx={{
                height: "calc(100% - 32px)",
                backgroundColor: "#F5F5F5",
                margin: 0,
                padding: 0,
                flex: "0 1 100%",
            }}
        >
            <Canva width={theWidth} height={theHeight}/>
        </Container>
    )
}

export default Main;