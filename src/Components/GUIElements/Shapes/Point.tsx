import React, { Dispatch, useRef } from "react";
import Konva from "konva";
import { connect } from "react-redux";
import { Circle, Group } from "react-konva";

import { setStartPoint } from "../../UseCases/SelectStartDest/selectStart";

import { PointGUIProps } from "../Types/Shapes/PointGUIProps";
import { State } from "../Types/Redux/State";
import { PointInfo } from "../Types/Shapes/PointInfo";
import { setDestinationPoint } from "../../UseCases/SelectStartDest/selectDestination";
import { InteractionMode } from "../../Utils/interactionMode";

const mapStateToProps = (state: State) => {
  return {
    startPoint: state.startPoint,
    destinationPoint: state.destinationPoint,
    usageMode: state.useMode,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setStartPoint: (event: Konva.KonvaEventObject<MouseEvent>): void =>
      dispatch(setStartPoint(event)),
    setDestinationPoint: (event: Konva.KonvaEventObject<MouseEvent>): void => 
      dispatch(setDestinationPoint(event)),
  };
};

interface PointProps extends PointGUIProps {
  startPoint?: PointInfo | null | undefined,
  destinationPoint?: PointInfo | null | undefined,
  usageMode?: InteractionMode,
  setStartPoint: (event: Konva.KonvaEventObject<MouseEvent>) => void,
  setDestinationPoint: (event: Konva.KonvaEventObject<MouseEvent>) => void,
}

const Point = (props: PointProps)=> {
  const groupRef = useRef(null);

  const handleClickOnPoint = (event: Konva.KonvaEventObject<MouseEvent>)=>{
    switch(props.usageMode) {
      case InteractionMode.PICK_START: {
        props.setStartPoint(event);
        break;
      }

      case InteractionMode.PICK_DESTINATION: {
        props.setDestinationPoint(event);
        break;
      }
    }
  }

  return (
    <React.Fragment>
      <Group
        draggable={props.isDraggable}
        ref={groupRef}
        name={props.name}
        onClick={(event: Konva.KonvaEventObject<MouseEvent>) => {
          handleClickOnPoint(event);
          props.onPointSelected(props.name, props.x, props.y);
        }}
        onDragEnd={() => {}}
      >
        <Circle
          x={props.x}
          y={props.y}
          radius={props.innerRadius}
          fill={props.error ? props.errorInnerFill : 
              ( props.startPoint?.id === props.name ) ? 
                  props.startInnerFill : 
                    ( props.destinationPoint?.id === props.name ) ? 
                        props.destInnerFill : props.innerFill
          }
          strokeWidth={1}
          stroke={props.innerStroke}
          strokeScaleEnabled={false}
          scale={{ x: props.scaleX!, y: props.scaleY! }}
        />
        <Circle
          x={props.x}
          y={props.y}
          radius={props.outerRadius}
          strokeScaleEnabled={false}
          fill={props.error ? props.errorOuterFill : 
            ( props.startPoint?.id === props.name ) ? 
                props.startOuterFill : 
                  ( props.destinationPoint?.id === props.name ) ? 
                      props.destOuterFill : props.outerFill
        }
          scale={{ x: props.scaleX!, y: props.scaleY! }}
        />
      </Group>
    </React.Fragment>
  );
};

Point.defaultProps = {
  scaleX: 1,
  scaleY: 1,
  startInnerFill: "#00CC00",
  startOuterFill: "rgba(0,204,0, 0.25)",
  destInnerFill: "#FF6699",
  destOuterFill: "rgba(255,153,204, 0.3)",
  errorInnerFill: "#680000",
  errorOuterFill: "rgba(255,82,82,0.5)",
  innerFill: "#006699",
  innerRadius: 5,
  outerRadius: 11,
  error: false,
  outerFill: "rgba(0,102,153,0.25)",
  innerStroke: "black",
  onPointSelected: () => {},
  isDraggable: false,
  onDragEnd: () => {},
  startPoint: undefined, 
  destinationPoint: undefined,
  usageMode: undefined,
  setStartPoint: undefined,
  setDestinationPoint: undefined,
}

export default connect(mapStateToProps, mapDispatchToProps)(Point);
