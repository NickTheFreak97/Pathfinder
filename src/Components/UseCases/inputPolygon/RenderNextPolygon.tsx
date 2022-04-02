import React from "react";
import { Line } from "react-konva";
import { connect } from "react-redux";
import { State } from "../../GUIElements/Types/Redux/State";
import { Vertex } from "../../GUIElements/Types/Shapes/PolygonGUIProps";
import _ from "lodash";

const mapStateToProps = (state: State) => {
  return {
    vertices: state.newPolygonVertices,
    currentPoint: state.currentPoint,
  };
};

const RenderNextPolygon: React.FC<{
  vertices: Vertex[];
  currentPoint: Vertex | null | undefined;
}> = ({ vertices, currentPoint }) => {
  return (
    <React.Fragment>
      <Line
        points={
          !!currentPoint
            ? _.flatten([...vertices, currentPoint])
            : _.flatten(vertices)
        }
        strokeWidth={1}
        stroke="#0EA5E9"
        lineCap="round"
        lineJoin="round"
      />
    </React.Fragment>
  );
};

export default connect(mapStateToProps)(RenderNextPolygon);
