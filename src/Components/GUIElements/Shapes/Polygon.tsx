import { useRef, useEffect, useState, Dispatch } from "react";
import Konva from "konva";
import { Shape, Group } from "react-konva";
import _ from 'lodash';
import { connect } from "react-redux";

import Point from "./Point";
import { PolygonGUIProps, Vertex } from "../Types/Shapes/PolygonGUIProps";
import { updateTransform } from "../../UseCases/TransformPolygon/UpdateTransform";
import { State } from "../Types/Redux/State";

interface AABB {
  x: number,
  y: number,
  width: number,
  height: number,
}

const mapStateToProps = (state: State) => {
  return {
    randomPolygonsInfo: state.randomPolyCircles,
  }
}

const mapDispatchToProps = ( dispatch: Dispatch<any> ) => {
  return {
    setTransform: ( polygonID: string, transform: Konva.Transform ) => dispatch( updateTransform(polygonID, transform) )
  }
}

const Polygon: React.FC<PolygonGUIProps> = (props) => {
  const shapeRef = useRef< { getSelfRect: ()=> AABB } & Konva.Shape >(null);
  const groupRef = useRef< { getSelfRect: ()=> AABB } & Konva.Group >(null);

  const [scaleX, updateScaleX] = useState<number>(1);
  const [scaleY, updateScaleY] = useState<number>(1);

  useEffect(
    ()=>{
      if( !!groupRef?.current )
        props.setTransform( props.name, groupRef.current.getTransform() );
    }, [groupRef?.current?.getTransform()]
  )

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

    if (groupRef && groupRef.current && shapeRef && shapeRef.current)
      groupRef.current.getSelfRect = shapeRef.current.getSelfRect;
  }, [props.points]);

  return (
    <Group
      ref={groupRef}
      name={props.name}
      onTransformEnd={_.debounce(() => { 
        updateScaleX(groupRef?.current?.scaleX() || 1);
        updateScaleY( groupRef?.current?.scaleY() || 1);
        props.setTransform( props.name, groupRef!.current!.getTransform() );
      }, 500)}
      onDragEnd={() => {
        props.setTransform( props.name, groupRef!.current!.getTransform() );
      }}
      draggable
    >
      <Shape
        strokeScaleEnabled={false}
        draggable={props.isDraggable}
        ref={shapeRef}
        name={props.name}
        fill={props.error? props.errorFill:props.fill}
        stroke={props.error? props.errorStroke: props.stroke}
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
            error={props.error}
            x={vertex[0]}
            y={vertex[1]}
            scaleX={ groupRef?.current && 1 / scaleX || undefined }
            scaleY={ groupRef?.current && 1 / scaleY || undefined }
            outerRadius={ props.isRandom ? 6: 11 }
            innerRadius={ props.isRandom ? 2: 5 }
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
  errorFill: "rgba(104,0,0, .5)",
  errorStroke: "#680000",
  error: false,
  isDraggable: false,
  onPointSelected: (pointID: string, pointX: number, pointY: number) => {
    console.log("Clicked point ", pointID, " at ", { x: pointX, y: pointY });
  },
  randomPolygonsInfo: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(Polygon);
