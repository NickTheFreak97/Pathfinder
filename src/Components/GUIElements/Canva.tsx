import React from "react";
import { Stage, Layer } from "react-konva";
import Grid from "./Shapes/Grid";
import RenderPolygons from "../UseCases/inputPolygon/RenderPolygons";

import { Provider } from "react-redux";
import { store } from "../Redux/Store/store";

interface CanvaProps {
  width?: number;
  height?: number;
}
const Canva: React.FC<CanvaProps> = ({ width, height }) => {
  
  /**
   * See this issue: https://stackoverflow.com/questions/71556080/uncaught-error-could-not-find-store-in-the-context-of-connectrenderpolygons
   * canvas elements must be wrapped inside a redux provider componend when under react-konva 
   */
  return (
    <Stage
      style={{
        backgroundColor: "#F9F9F9",
        width: width ? width + "px" : "0px",
        height: height ? height * 0.75 + "px" : "0px",
        boxShadow: "#E5E2E2 0px 6px 6px -3px",
      }}
      width={width}
      height={height}
      onMouseDown={() => {}}
      onMouseMove={() => {}}
      onClick={() => {}}
    >
      <Provider store={store}>
        <Grid
          width={width}
          height={height ? height * 0.75 : window.innerHeight}
        />
        <RenderPolygons />
      </Provider>
    </Stage>
  );
};

export default Canva;
