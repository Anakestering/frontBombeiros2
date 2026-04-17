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

  // 🔥 OCULTAR UM
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

      setRegistros(prev => prev.filter(r => r.id !== id));

    } catch (err) {
      console.error("Erro fetch:", err);
    }
  }

  // 🔥 OCULTAR TODOS
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

      setRegistros([]);

    } catch (err) {
      console.error("Erro fetch:", err);
    }
  }

  useEffect(() => {
    carregarRegistros();
  }, []);

  // 🔥 SEPARAÇÃO
  const checkins = registros.filter(r => r.tipo === "CHECKIN");
  const checkouts = registros.filter(r => r.tipo === "CHECKOUT");

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
              Check-ins e Checkouts do dia
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
          <div className="space-y-4">

            {/* 📸 CHECK-INS */}
            <div>
              <h2 className="text-sm font-semibold text-blue-700 mb-2">
                📸 Check-ins
              </h2>

              {checkins.length === 0 ? (
                <p className="text-xs text-gray-400 text-center">
                  Nenhum check-in
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {checkins.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white rounded-lg p-2 shadow-sm text-center"
                    >
                      <img
                        src={r.foto}
                        onClick={() => setImagemAberta(r.foto)}
                        className="w-full h-24 object-cover rounded-lg mb-1 cursor-pointer hover:scale-105 transition"
                      />

                      <p className="text-xs font-medium">
                        Posto {r.posto}
                      </p>

                      <p className="text-[10px] text-gray-400">
                        {r.dataHora}
                      </p>

                      <button
                        onClick={() => ocultarRegistro(r.id)}
                        className="text-[10px] text-red-600 mt-1"
                      >
                        Ocultar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 🚪 CHECKOUTS */}
            <div>
              <h2 className="text-sm font-semibold text-green-700 mb-2">
                🚪 Checkouts
              </h2>

              {checkouts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center">
                  Nenhum checkout
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {checkouts.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white rounded-lg p-2 shadow-sm text-center"
                    >
                      <img
                        src={r.foto}
                        onClick={() => setImagemAberta(r.foto)}
                        className="w-full h-24 object-cover rounded-lg mb-1 cursor-pointer hover:scale-105 transition"
                      />

                      <p className="text-xs font-medium">
                        Posto {r.posto}
                      </p>

                      <p className="text-[10px] text-gray-400">
                        {r.dataHora}
                      </p>

                      <button
                        onClick={() => ocultarRegistro(r.id)}
                        className="text-[10px] text-red-600 mt-1"
                      >
                        Ocultar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 🔥 MODAL */}
      {imagemAberta && (
        <div
          onClick={() => setImagemAberta(null)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
        >
          <img
            src={imagemAberta}
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl"
          />
        </div>
      )}

    </div>
  );
}