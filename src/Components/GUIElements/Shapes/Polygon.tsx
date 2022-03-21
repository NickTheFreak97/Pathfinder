import React, { useRef, useEffect } from "react";
import { Shape, Group } from "react-konva";
import Point from "./Point";

import { PolygonGUIProps, Vertex } from "../Types/Shapes/PolygonGUIProps";

const Polygon = (props: PolygonGUIProps) => {
  const shapeRef = useRef<any>();
  const groupRef = useRef<any>();

  useEffect(() => {
    /**
     * Create the bounding box for the polygon
     */
    if (shapeRef && shapeRef.current)
      shapeRef.current.getSelfRect = () => {
        let minX = Math.min.apply(
          Math,
          props.points.map((point: Vertex) => point[0])
        );
        let maxX = Math.max.apply(
          Math,
          props.points.map((point: Vertex) => point[0])
        );
        let minY = Math.min.apply(
          Math,
          props.points.map((point: Vertex) => point[1])
        );
        let maxY = Math.max.apply(
          Math,
          props.points.map((point: Vertex) => point[1])
        );

        return {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
        };
      };

    if (groupRef && groupRef.current)
      groupRef.current.getSelfRect = shapeRef.current.getSelfRect;
  }, []);

  return (
    <Group
      ref={groupRef}
      name={props.name}
      onTransformEnd={() => {}}
      onDragEnd={() => {}}
      draggable
    >
      <Shape
        strokeScaleEnabled={false}
        draggable={props.isDraggable}
        ref={shapeRef}
        name={props.name}
        fill={props.fill}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
        sceneFunc={(context, shape) => {
          context.beginPath();

          for (let i = 0; i < props.points.length; i++) {
            context.lineTo(
              props.points[(i + 1) % props.points.length][0], //x
              props.points[(i + 1) % props.points.length][1]  //y
            );
          }

          context.closePath();
          context.fillStrokeShape(shape);
        }}
      />

      {props.points.map((vertex: Vertex, i: number) => (
          <Point
            x={vertex[0]}
            y={vertex[1]}
            name={props.name + "_p_" + i}
            onPointSelected={props.onPointSelected}
            key={props.name + '_p_' + i}
          />
      ))}
    </Group>
  );
};

Polygon.defaultProps = {
  fill: "rgb(245,251,254)",
  strokeWidth: 1,
  stroke: "#0EA5E9",
  isDraggable: false,
  onPointSelected: (pointID: string, pointX: number, pointY: number) => {
    console.log("Clicked point ", pointID, " at ", { x: pointX, y: pointY });
  },
};

export default Polygon;
