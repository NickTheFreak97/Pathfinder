import { AppShell } from "@mantine/core";

import Sidebar from "./Components/GUIElements/Sidebar";
import Main from "./Components/GUIElements/Main";

import "./App.css";

const App = ()=> {
  
  return (
    <AppShell
      style={{ backgroundColor: "#f8f9f9", display: "flex" }}
      navbar={<Sidebar />}
    >
      <Main />
    </AppShell>
  );
};

export default App;
