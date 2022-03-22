import React, { useEffect } from "react";
import { Layer } from "react-konva";
import { connect } from "react-redux";

import Polygon from "../../GUIElements/Shapes/Polygon";
import { Polygon as Polygon_T } from "../../GUIElements/Types/Shapes/Polygon";
import { State } from "../../GUIElements/Types/Redux/State";

const mapStateToProps = (state: State) => {
  return {
    polygons: state.polygons,
  };
};

const RenderPolygons: React.FC<{ polygons: Polygon_T[] }> = ({ polygons }) => {
  return (
    <Layer>
      {polygons.map((polygon: Polygon_T) => (
        <Polygon points={polygon.vertices} name={polygon.id} key={polygon.id} />
      ))}
    </Layer>
  );
};

export default connect(mapStateToProps)(RenderPolygons);
