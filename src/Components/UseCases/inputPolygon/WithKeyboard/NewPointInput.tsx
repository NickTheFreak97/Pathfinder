import React, { useState } from "react";
import { Grid, NumberInput, ActionIcon } from "@mantine/core";
import { PlusIcon } from "@modulz/radix-icons";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";

import { updateVertices } from "../Actions/updateVertices";
import { addPolygon } from "../Actions/addPolygon";
import { setCurrentPoint } from "../Actions/setCurrentPoint";

import { isAreaClosed } from "../WithMouse/viaClick";
import { isConvex } from "./ConvexityTest";

import { Polygon } from "../../../GUIElements/Types/Shapes/Polygon";
import { State } from "../../../GUIElements/Types/Redux/State";
import {
  ThreeOrMoreVertices,
  Vertex,
} from "../../../GUIElements/Types/Shapes/PolygonGUIProps";

interface NewPointInputProps {
  vertices: Vertex[];
  updateVertices: (vertices: Vertex[]) => void;
  addPolygon: (polygon: Polygon) => void;
  setCurrentPoint: (point: Vertex | null | undefined) => void;
}

const mapStateToProps = (state: State) => {
  return {
    vertices: state.newPolygonVertices,
  };
};

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => {
  return {
    updateVertices: (vertices: Vertex[]) => dispatch(updateVertices(vertices)),
    addPolygon: (polygon: Polygon) => dispatch(addPolygon(polygon)),
    setCurrentPoint: (point: Vertex | null | undefined) =>
      dispatch(setCurrentPoint(point)),
  };
};

const PointInput: React.FC<NewPointInputProps> = ({
  vertices,
  updateVertices,
  addPolygon,
  setCurrentPoint,
}) => {
  const [theVertex, setTheVertex] = useState<Vertex | undefined>([0, 0]);

  const handleClick = () => {
    const areaClosed = isAreaClosed(vertices, theVertex!);
    if (areaClosed && vertices.length + 1 >= 3) {
      setCurrentPoint(undefined);
      updateVertices([]);
      addPolygon({
        id: uuidv4(),
        vertices: vertices as ThreeOrMoreVertices,
        isConvex: isConvex(vertices),
      });
    } else if (!areaClosed) updateVertices([...vertices, theVertex!]);
  };

  if (!!theVertex)
    return (
      <React.Fragment>
        <Grid.Col span={4}>
          <NumberInput
            label="x:"
            defaultValue={theVertex[0] || 0}
            value={theVertex[0]}
            onChange={(newX: number) =>
              newX &&
              setTheVertex((oldVertex: Vertex | undefined) => [
                newX,
                oldVertex![1],
              ])
            }
            precision={2}
            step={0.05}
            hideControls
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            label="y:"
            defaultValue={theVertex[1] || 0}
            value={theVertex[1]}
            onChange={(newY: number) => {
              newY &&
                setTheVertex((oldVertex: Vertex | undefined) => [
                  oldVertex![0],
                  newY,
                ]);
            }}
            precision={2}
            step={0.05}
            hideControls
          />
        </Grid.Col>
        <Grid.Col span={2} style={{ display: "flex" }}>
          <ActionIcon
            variant="outline"
            style={{
              alignSelf: "flex-end",
              marginBottom: "0.375rem",
            }}
            onClick={handleClick}
          >
            <PlusIcon />
          </ActionIcon>
        </Grid.Col>
      </React.Fragment>
    );
  else return null;
};

export default connect(mapStateToProps, mapDispatchToProps)(PointInput);
