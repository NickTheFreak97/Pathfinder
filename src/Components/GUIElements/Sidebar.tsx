import React from 'react';
import { Navbar } from '@mantine/core';

import ModeSelector from './ModeSelector';

const Sidebar = () => {
    return <Navbar
    style={{
      height: "100vh",
      width: "fit-content",
      padding: "1rem",
    }}
  >
    <ModeSelector />
  </Navbar>
}

export default Sidebar;