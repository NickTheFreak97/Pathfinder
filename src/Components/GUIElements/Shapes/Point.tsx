import React, { useRef } from "react";
import { Circle, Group } from "react-konva";
import { PointGUIProps } from "../Types/Shapes/PointGUI";

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
          fill={props.innerFill}
          strokeWidth={1}
          stroke={props.stroke}
          strokeScaleEnabled={false}
        />
        <Circle
          x={props.x}
          y={props.y}
          radius={11}
          strokeScaleEnabled={false}
          fill={props.outerFill}
        />
      </Group>
    </React.Fragment>
  );
};

Point.defaultProps = {
  scaleX: 1,
  scaleY: 1,
  innerFill: "#006699",
  outerFill: "rgba(0,102,153,0.25)",
  innerStroke: "black",
  onPointSelected: () => {},
  isStartingPoint: false,
  isDestPoint: false,
  isDraggable: false,
  onDragEnd: () => {},
};

export default Point;
