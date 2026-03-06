import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Cervical from "./pages/Cervical";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/cervical" element={<Cervical />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;