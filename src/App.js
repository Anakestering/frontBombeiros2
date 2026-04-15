import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { Postos } from "./components/Postos";
import { PostoUsuario } from "./components/Dashboard";
import { PostoAdmin } from "./components/Admin";
import { AdminRegistros } from "./components/AdminRegistros";
import { AdminRelatorios } from "./components/AdminRelatorios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/posto/:id" element={<PostoUsuario />} />
        <Route path="/admin/posto/:id" element={<PostoAdmin />} />
        <Route path="/postos/ordenado" element={<Postos />} />
        <Route path="/admin/registros" element={<AdminRegistros />} />
        <Route path="/admin/relatorios" element={<AdminRelatorios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;