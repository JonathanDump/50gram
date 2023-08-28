import { Outlet } from "react-router-dom";
import cl from "./App.module.scss";

function App() {
  return (
    <div className={cl.app}>
      <Outlet />
    </div>
  );
}

export default App;
