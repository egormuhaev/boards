import Router from "./app/Router";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="h-[100vh] w-[100%] overflow-auto relative">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
