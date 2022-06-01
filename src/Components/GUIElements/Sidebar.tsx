import React from 'react';
import { Navbar } from '@mantine/core';
import { connect } from 'react-redux';

import ModeSelector from './ModeSelector';

import { InteractionMode } from '../Utils/interactionMode';
import { State } from './Types/Redux/State';
import PointInputsGrid from '../UseCases/InputPolygon/WithKeyboard/PointInputsGrid';
import AlgorithmsSelector from '../UseCases/RunAlgorithms/AlgorithmsSelector';

const mapStateToProps = (state: State) => {
  return {
    usageMode: state.useMode,
  }
}

const Sidebar : React.FC<{ usageMode: InteractionMode }>  = ({ usageMode }) => {
    return (
      <Navbar
        style={{
          height: "fit-content",
          minHeight: '100vh',
          overflow: 'hidden',
          width: "fit-content",
          padding: "1rem",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <ModeSelector />
        {
          usageMode === InteractionMode.DRAW_POLYGON &&
          <PointInputsGrid />
        }
        {
          usageMode === InteractionMode.RUN_ALGORITHM &&
          <AlgorithmsSelector />
        }
      </Navbar>
    )
}

export default connect(mapStateToProps)(Sidebar);