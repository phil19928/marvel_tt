import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Characters from "./pages/Characters";
import CharacterDetail from "./pages/CharacterDetail";
import Comics from "./pages/Comics";
import Favorites from "./pages/Favorites";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Redirige la racine vers /characters */}
          <Route index element={<Navigate to="/characters" replace />} />
          <Route path="characters" element={<Characters />} />
          <Route path="characters/:id" element={<CharacterDetail />} />
          <Route path="comics" element={<Comics />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
