import React, { Dispatch, useRef } from "react";
import Konva from "konva";
import { connect } from "react-redux";
import { Circle, Group } from "react-konva";

import { setStartPoint } from "../../UseCases/SelectStartDest/selectStart";

import { PointGUIProps } from "../Types/Shapes/PointGUIProps";
import { State } from "../Types/Redux/State";
import { PointInfo } from "../Types/Shapes/PointInfo";

const mapStateToProps = (state: State) => {
  return {
    startPoint: state.startPoint,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setStartPoint: (event: Konva.KonvaEventObject<MouseEvent>): void =>
      dispatch(setStartPoint(event)),
  };
};

const Point = (
  props: {
    setStartPoint: (event: Konva.KonvaEventObject<MouseEvent>) => void;
    startPoint: PointInfo | null | undefined;
  } & PointGUIProps
) => {
  const groupRef = useRef(null);

  return (
    <React.Fragment>
      <Group
        draggable={props.isDraggable}
        ref={groupRef}
        name={props.name}
        onClick={(event: Konva.KonvaEventObject<MouseEvent>) => {
          setStartPoint(event);
          props.onPointSelected(props.name, props.x, props.y);
        }}
        onDragEnd={() => {}}
      >
        <Circle
          x={props.x}
          y={props.y}
          radius={5}
          fill={props.error ? props.errorInnerFill : ( props.startPoint?.id === props.name ) ? props.startInnerFill : props.innerFill}
          strokeWidth={1}
          stroke={props.innerStroke}
          strokeScaleEnabled={false}
          scale={{ x: props.scaleX!, y: props.scaleY! }}
        />
        <Circle
          x={props.x}
          y={props.y}
          radius={11}
          strokeScaleEnabled={false}
          fill={props.error ? props.errorOuterFill : ( props.startPoint?.id === props.name ) ? props.startOuterFill : props.outerFill}
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
  error: false,
  outerFill: "rgba(0,102,153,0.25)",
  innerStroke: "black",
  onPointSelected: () => {},
  isStartingPoint: false,
  isDestPoint: false,
  isDraggable: false,
  onDragEnd: () => {},
};

export default connect(mapStateToProps, mapDispatchToProps)(Point);
