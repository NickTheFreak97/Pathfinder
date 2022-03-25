import React, { useRef } from "react";
import { Circle, Group } from "react-konva";
import { PointGUIProps } from "../Types/Shapes/PointGUIProps";

const Point = (props: PointGUIProps) => {
  const groupRef = useRef(null);

  return (
    <React.Fragment>
      <Group
        draggable={props.isDraggable}
        ref={groupRef}
        name={props.name}
        onClick={() => {
          props.onPointSelected(props.name, props.x, props.y);
        }}
        onDragEnd={() => {}}
      >
        <Circle
          x={props.x}
          y={props.y}
          radius={5}
          fill={props.error? props.errorInnerFill : props.innerFill}
          strokeWidth={1}
          stroke={props.stroke}
          strokeScaleEnabled={false}
          scale={{x: props.scaleX!, y: props.scaleY!}}
        />
        <Circle
          x={props.x}
          y={props.y}
          radius={11}
          strokeScaleEnabled={false}
          fill={props.error? props.errorOuterFill : props.outerFill}
          scale={{x: props.scaleX!, y: props.scaleY!}}
        />
      </Group>
    </React.Fragment>
  );
};

Point.defaultProps = {
  scaleX: 1,
  scaleY: 1,
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

export default Point;
