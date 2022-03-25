import React, { useState, useEffect } from "react";
import { Grid, NumberInput, ActionIcon } from "@mantine/core";
import { UpdateIcon } from "@modulz/radix-icons";

import { connect } from "react-redux";
import { State } from "../../../GUIElements/Types/Redux/State";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";

import { updateVertices } from "../Actions/updateVertices";

interface PointInputProps {
  pointID: number;
  vertices: Vertex[];
  updateVertices: (vertices: Vertex[]) => void;
}

const mapStateToProps = (state: State) => {
  return {
    vertices: state.newPolygonVertices,
  };
};

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => {
  return {
    updateVertices: (vertices: Vertex[]) => dispatch(updateVertices(vertices)),
  };
};

const PointInput: React.FC<PointInputProps> = ({
  pointID,
  vertices,
  updateVertices,
}) => {

  const [theVertex, setTheVertex] = useState<Vertex | undefined>(undefined);

  useEffect(() => {
    setTheVertex(vertices[pointID]);
  }, [vertices, pointID]);

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
            onClick={() => {
              console.log(theVertex);
              const newVertices = [...vertices];
              newVertices.splice(pointID, 0);
              newVertices.splice(pointID, 1, theVertex);

              updateVertices(newVertices);
            }}
          >
            <UpdateIcon />
          </ActionIcon>
        </Grid.Col>
      </React.Fragment>
    );
  else return null;
};

export default connect(mapStateToProps, mapDispatchToProps)(PointInput);
