import { Navigate, Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home";
import Levels from "./pages/Levels";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Navigate to="/levels" replace />} />
      <Route path="/game/:mapId" element={<Game />} />
      <Route path="/levels" element={<Levels />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
