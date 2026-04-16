import { useState, useEffect } from "react";
import fundo from "../assets/fundo.jpg";
import logo from "../assets/Logo1.png";

export function AdminRegistros() {
  const [registros, setRegistros] = useState([]);
  const [imagemAberta, setImagemAberta] = useState(null);

  // 🔥 BUSCAR DO BACKEND
  async function carregarRegistros() {
    try {
      const response = await fetch("http://localhost:8080/registros");
      const data = await response.json();

      const formatados = data.map(r => ({
        id: r.id, 
        foto: r.urlImagem,
        tipo: r.tipo,
        posto: r.postoId,
        dataHora: new Date(r.dataHora).toLocaleString()
      }));

      setRegistros(formatados);

    } catch (err) {
      console.error("Erro ao carregar registros", err);
    }
  }

  // 🔥 OCULTAR RELATÓRIO (soft delete visual)
  async function ocultarRegistro(id) {
    try {
      const response = await fetch(
        `http://localhost:8080/registros/ocultar/${id}`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Erro backend:", text);
        return;
      }

      // remove da tela sem reload
      setRegistros(prev => prev.filter(r => r.id !== id));

    } catch (err) {
      console.error("Erro fetch:", err);
    }
  }

  async function ocultarTodos() {
    try {
      const response = await fetch(
        "http://localhost:8080/registros/ocultar-todos",
        { method: "PATCH" }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Erro backend:", text);
        return;
      }

      setRegistros([]); // limpa tela imediatamente

    } catch (err) {
      console.error("Erro fetch:", err);
    }
  }

  useEffect(() => {
    carregarRegistros();
  }, []);

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto">

      {/* 🌫️ FUNDO */}
      <img src={fundo} className="absolute w-full h-full object-cover" />
      <div className="absolute w-full h-full backdrop-blur-sm bg-black/30"></div>

      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl space-y-5">

          {/* 🔝 HEADER */}
          <div className="flex flex-col items-center border-b pb-3">
            <img src={logo} className="w-16 mb-2" />
            <h1 className="text-xl font-bold">Registros</h1>
            <p className="text-xs text-gray-500">
              Check-ins realizados
            </p>
          </div>

          {/* 🗑️ AÇÃO */}
          <button
            onClick={ocultarTodos}
            className="bg-red-700 hover:bg-red-800 text-white p-3 rounded-lg w-full"
          >
            Ocultar todos
          </button>

          {/* 📸 LISTA */}
          <div>
            {registros.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                Nenhum registro encontrado
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {registros.map((r, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-2 shadow-sm text-center"
                  >
                    <img
                      src={r.foto}
                      onClick={() => setImagemAberta(r.foto)} // 🔥 AQUI
                      className="w-full h-24 object-cover rounded-lg mb-1 cursor-pointer hover:scale-105 transition"
                      alt=""
                    />

                    <p className="text-xs font-medium">
                      Posto {r.posto}
                    </p>

                    <p className="text-[11px] text-gray-500">
                      {r.tipo}
                    </p>

                    <p className="text-[10px] text-gray-400">
                      {r.dataHora}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 🔥 MODAL DA IMAGEM */}
      {imagemAberta && (
        <div
          onClick={() => setImagemAberta(null)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
        >
          <img
            src={imagemAberta}
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl"
            alt=""
          />
        </div>
      )}

    </div>
  );
}