import { jsx as _jsx } from "react/jsx-runtime";
import "./index.css";
import Pools from "./routes/pool";
function App() {
    return (_jsx("div", { className: "w-screen min-h-screen bg-pageBg ", children: _jsx(Pools, {}) }));
}
export default App;
