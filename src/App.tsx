import { isMobile } from "react-device-detect";
import Router from "./app/Router";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div
      style={{ height: isMobile ? "calc(100vh - 65px)" : "100vh" }}
      className="w-[100%]  relative"
    >
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
