import React, { Dispatch } from "react";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import Konva from "konva";
import { Stage, Layer } from "react-konva";

import Grid from "./Shapes/Grid";
import RenderPolygons from "../UseCases/InputPolygon/RenderPolygons";
import RenderNextPolygon from "../UseCases/InputPolygon/RenderNextPolygon";
import PolygonTransformer from "./Shapes/PolygonTransformer";
import RenderStartDest from "../UseCases/SelectStartDest/Common/RenderStartDest";
import RenderRays from "../Algorithms/Common/RenderRays";
import ViewSolution from "../UseCases/RunAlgorithms/ViewSolution/ViewSolution";

import { store } from "../Redux/Store/store";

import { inputPolygonViaClick } from "../UseCases/InputPolygon/WithMouse/viaClick";
import { handlePolygonSelection } from "../UseCases/SelectPolygon/setPolygonID"; 
import { deletePolygon } from "../UseCases/DeletePolygon/deletePolygon";
import { handleMouseMove } from "../UseCases/InputPolygon/WithMouse/onMouseMove";
import { setStartPoint } from "../UseCases/SelectStartDest/selectStart";
import { setDestinationPoint } from "../UseCases/SelectStartDest/selectDestination";
import { InteractionMode } from "../Utils/interactionMode";
import { State } from "./Types/Redux/State";
import { RunningOptions } from "../UseCases/RunAlgorithms/Types/RunningOptions";
import RenderFrontier from "../UseCases/RunAlgorithms/ViewSolution/RenderFrontier";
import RenderExplored from "../UseCases/RunAlgorithms/ViewSolution/RenderExplored";
import RenderHitboxes from "../Utils/AABBTree/RenderHitboxes";
import RenderLog from "../UseCases/RunAlgorithms/ViewSolution/RenderLog";
import RenderSamples from "../UseCases/RandomScene/RenderSamples";

const mapStateToProps = (state: State) => {
  return {
    usageMode: state.useMode,
    selectedPolygonID: state.selectedPolygonID,
    options: state.options,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    updateSelectedPolygonID: (event: Konva.KonvaEventObject<MouseEvent>) : void => dispatch(handlePolygonSelection(event)),
    deletePolygon: (event: Konva.KonvaEventObject<MouseEvent>) : void => dispatch(deletePolygon(event)),
    setStartPoint: (event: Konva.KonvaEventObject<MouseEvent>) : void => dispatch(setStartPoint(event)),
    setDestinationPoint: (event: Konva.KonvaEventObject<MouseEvent>) : void => dispatch(setDestinationPoint(event)),
  }
}

interface CanvaProps {
  width?: number;
  height?: number;
  usageMode: InteractionMode;
  selectedPolygonID: string | null | undefined,
  options: RunningOptions,
  updateSelectedPolygonID: (event: Konva.KonvaEventObject<MouseEvent>) => void,
  deletePolygon: (event: Konva.KonvaEventObject<MouseEvent>) => void,
  setStartPoint: (event: Konva.KonvaEventObject<MouseEvent>) => void,
  setDestinationPoint: (event: Konva.KonvaEventObject<MouseEvent>) => void,
}

const Canva: React.FC<CanvaProps> = ({ width, height, usageMode, options, updateSelectedPolygonID, deletePolygon, setStartPoint, setDestinationPoint }) => {

  const onMouseDown = (event: Konva.KonvaEventObject<MouseEvent>) => {
    switch( usageMode ) {
      case InteractionMode.DRAW_POLYGON: {
        inputPolygonViaClick(event);
        break;
      }

      case InteractionMode.SELECT: {
        updateSelectedPolygonID(event);
        break;
      }

      case InteractionMode.DELETE_POLYGON: {
        deletePolygon(event);
        break;
      }

      case InteractionMode.PICK_START: {
        setStartPoint(event);
        break;
      }

      case InteractionMode.PICK_DESTINATION: {
        setDestinationPoint(event);
      }
    }
  }

  const onMouseMove = (event: Konva.KonvaEventObject<MouseEvent>) => {
    switch( usageMode ) {
      case InteractionMode.DRAW_POLYGON: {
        handleMouseMove(event);
        break;
      }

      case InteractionMode.RUN_ALGORITHM: {
        break;
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
        <Layer>
          <RenderSamples width={width}
            height={height ? height * 0.75 : window.innerHeight } 
            samplesCnt={75}  
            maxVertices={20}
          />
            
          <RenderHitboxes />
          <RenderPolygons />
          {
              usageMode === InteractionMode.DRAW_POLYGON &&
                <RenderNextPolygon />
            }
          <PolygonTransformer />
        </Layer>
        <Layer>
          { options.verbose.show.visibility && <RenderRays /> }
          <RenderFrontier />
          <RenderExplored />
          <ViewSolution />
          <RenderStartDest />
          <RenderLog stageWidth={width || 0} stageHeight={height || 0}/>
        </Layer>
      </Provider>
    </Stage>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Canva);
