import React from 'react';
import { Stage, Layer, Circle } from 'react-konva';

interface CanvaProps {
    width?: number,
    height?: number,
}

const Canva = (props : CanvaProps) => {

    return (
        <Stage
            style={{
              backgroundColor: "#F9F9F9",
              width: props.width? props.width+"px" : "0px",
              height: props.height? (props.height*.75)+"px":"0px",
              boxShadow:
                    "#E5E2E2 0px 6px 6px -3px",
            }}
            width={props.width}
            height={props.height}
            onMouseDown={ ()=>{ } }
            onMouseMove={ ()=>{ } }
            onClick={ ()=> { } }
            
          >

          </Stage>
    )
}

export default Canva;