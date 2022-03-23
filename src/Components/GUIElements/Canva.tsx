import React, { useState } from "react";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import Konva from "konva";

import { Stage } from "react-konva";
import Grid from "./Shapes/Grid";
import RenderPolygons from "../UseCases/InputPolygon/RenderPolygons";

import { store } from "../Redux/Store/store";

import { inputPolygonViaClick } from "../UseCases/InputPolygon/WithMouse/viaClick";
import { handleMouseMove } from "../UseCases/InputPolygon/WithMouse/onMouseMove";
import { State } from "./Types/Redux/State";
import { InteractionMode } from "../Utils/interactionMode";
import RenderNextPolygon from "../UseCases/InputPolygon/RenderNextPolygon";

const mapStateToProps = (state: State) => {
  return {
    usageMode: state.useMode,
  };
};

interface CanvaProps {
  width?: number;
  height?: number;
  usageMode: InteractionMode;
}

const Canva: React.FC<CanvaProps> = ({ width, height, usageMode }) => {

  const onMouseDown = (event: Konva.KonvaEventObject<MouseEvent>) => {
    switch( usageMode ) {
      case InteractionMode.DRAW_POLYGON: {
        inputPolygonViaClick(event);
      }
    }
  }

  const onMouseMove = (event: Konva.KonvaEventObject<MouseEvent>) => {
    switch( usageMode ) {
      case InteractionMode.DRAW_POLYGON: {
        handleMouseMove(event);
      }
    }
  }

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
      onMouseDown={(evt: Konva.KonvaEventObject<MouseEvent>) => onMouseDown(evt)}
      onMouseMove={(evt: Konva.KonvaEventObject<MouseEvent>) => onMouseMove(evt)}
      onClick={() => {}}
    >
      <Provider store={store}>
        <Grid
          width={width}
          height={height ? height * 0.75 : window.innerHeight}
        />
        <RenderPolygons />
        {
          usageMode === InteractionMode.DRAW_POLYGON &&
            <RenderNextPolygon />
        }
      </Provider>
    </Stage>
  );
};

export default connect(mapStateToProps)(Canva);
