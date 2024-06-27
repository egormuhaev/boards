import Router from "./app/Router";
import { BrowserRouter } from "react-router-dom";
// import FlowMonitor from "./flow/FlowMonitor";

function App() {
  return (
    <div className="h-[100vh] w-[100%] overflow-auto relative">
      <BrowserRouter>
        <Router />
      </BrowserRouter>

      {/* <FlowMonitor /> */}
    </div>
  );
}

export default App;
