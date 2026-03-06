import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Breast from "./pages/Breast";
import Cervical from "./pages/Cervical";
import PCOS from "./pages/PCOS";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/breast" element={<Breast />} />
          <Route path="/cervical" element={<Cervical />} />
          <Route path="/pcos" element={<PCOS />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
