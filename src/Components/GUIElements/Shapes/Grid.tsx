import React from "react";
import { Layer, Line, Text } from "react-konva";

interface TextProps {
  x: number;
  y: number;
  text: string;
}

const CoordinatesTxt = (props: TextProps) => {
  return (
    <Text
      text={props.text}
      x={props.x}
      y={props.y}
      width={40}
      height={10}
      fontSize={10}
      fontFamily={"Calibri"}
      align={"left"}
      fill={"black"}
      listening={false}
      perfectDrawEnabled={false}
      transformsEnabled="position"
      shadowEnabled={false}
      shadowForStrokeEnabled={false}
    />
  );
};

/**
 * Creazione griglia ispirata ad i seguenti link:
 *  1: https://eecs.blog/javascript-2d-library-konva-js/ (linee griglia) 
 *  2: https://codepen.io/JEE42/pen/MWjLVaO (coordinate)
 */
interface GridProps {
  width: number;
  height: number;
  padding: number;
}

const Grid = (props: GridProps) => {
  var width = props.width;
  var height = props.height;
  var padding = props.padding;

  const horizontal =
    width > 0 &&
    Array.from(Array(Math.floor(width / padding) + 1).keys()).map((i) => (
      <React.Fragment key={i}>
        <Line
          points={[
            Math.round(i * padding) + 0.5,
            0,
            Math.round(i * padding) + 0.5,
            height,
          ]}
          stroke={i === 0 ? "rgba(0,0,0,0.7)" : "#ddd"}
          strokeWidth={i === 0 ? 2 : 1}
        />
        <CoordinatesTxt
          x={i !== 0 ? Math.round(i * padding) : 5}
          y={5}
          text={Math.round(i * padding).toString()}
        />
      </React.Fragment>
    ));

  const vertical =
    height > 0 &&
    Array.from(Array(Math.floor(height / padding) + 1).keys()).map((j) => (
      <React.Fragment key={j}>
        <Line
          points={[0, Math.round(j * padding), width, Math.round(j * padding)]}
          stroke={j === 0 ? "rgba(0,0,0,0.7)" : "#ddd"}
          strokeWidth={j === 0 ? 2 : 1}
        />
        {j !== 0 && (
          <CoordinatesTxt
            x={5}
            y={Math.round(j * padding)}
            text={Math.round(j * padding).toString()}
          />
        )}
      </React.Fragment>
    ));

  return (
    <Layer>
      {horizontal}
      <Line points={[0, 0, 10, 10]} />
      {vertical}
    </Layer>
  );
};

Grid.defaultProps = {
  width: window.innerWidth,
  height: window.innerWidth,
  padding: 30,
};

export default Grid;
