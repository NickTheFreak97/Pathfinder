import React, { Dispatch } from "react";
import { SegmentedControl, Center, Box } from "@mantine/core";
import { connect } from "react-redux";

import {
  SewingPinIcon,
  SewingPinFilledIcon,
  SquareIcon,
  HandIcon,
  PlayIcon,
  Cross1Icon,
} from "@modulz/radix-icons";

import {
  changeMode,
  ChangeModeAction,
} from "../UseCases/ChangeMode/changeMode";

import { InteractionMode } from "../Utils/interactionMode";
import { State } from "./Types/Redux/State";

const mapStateToProps = (state: State) => {
  return {
    mode: state.useMode,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<ChangeModeAction>) => {
  return {
    changeMode: (newMode: InteractionMode) => dispatch(changeMode(newMode)),
  };
};

const ModeSelector: React.FC<{ mode: InteractionMode, changeMode: (mode: InteractionMode) => void }> = ({mode, changeMode}) => {

  return (
    <SegmentedControl
      value={mode}
      onChange={(newMode: InteractionMode) => {
        changeMode(newMode);
      }}
      
      style={{width: '250px', flexBasis: '23%', flexShrink: '0'}}

      orientation="vertical"
      data={[
        {
          value: InteractionMode.DRAW_POLYGON,
          label: (
            <Center>
              <SquareIcon />
              <Box ml={10}>Polygon</Box>
            </Center>
          ),
        },
        {
          value: InteractionMode.DELETE_POLYGON,
          label: (
            <Center>
              <Cross1Icon />
              <Box ml={10}>Delete</Box>
            </Center>
          ),
        },
        {
          value: InteractionMode.SELECT,
          label: (
            <Center>
              <HandIcon />
              <Box ml={10}>Selection</Box>
            </Center>
          ),
        },
        {
          value: InteractionMode.PICK_START,
          label: (
            <Center>
              <SewingPinIcon />
              <Box ml={10}>Start point</Box>
            </Center>
          ),
        },
        {
          value: InteractionMode.PICK_DESTINATION,
          label: (
            <Center>
              <SewingPinFilledIcon />
              <Box ml={10}>Destination</Box>
            </Center>
          ),
        },
        {
          value: InteractionMode.RUN_ALGORITHM,
          label: (
            <Center>
              <PlayIcon />
              <Box ml={10}>Run algorithms</Box>
            </Center>
          ),
        },
      ]}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ModeSelector);