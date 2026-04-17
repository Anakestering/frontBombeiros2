import { useState, useEffect } from "react";
import fundo from "../assets/fundo.jpg";
import logo from "../assets/Logo1.png";

// 🔥 IMPORTAÇÕES DO TEU SISTEMA NOVO
import { confirmar, sucesso, erro } from "../utils/feedback";

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
      console.error(err);
      erro("Erro ao carregar registros");
    }
  }

  // 🔥 OCULTAR UM (COM CONFIRMAÇÃO)
  async function ocultarRegistro(id) {
    const ok = await confirmar({
      titulo: "Ocultar registro",
      texto: "Tem certeza que deseja ocultar este registro?"
    });

    if (!ok) return;

    try {
      const response = await fetch(
        `http://localhost:8080/registros/ocultar/${id}`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        erro("Erro ao ocultar registro");
        return;
      }

      setRegistros(prev => prev.filter(r => r.id !== id));
      sucesso("Registro ocultado");

    } catch (err) {
      console.error(err);
      erro("Erro no servidor");
    }
  }

  // 🔥 OCULTAR TODOS (COM CONFIRMAÇÃO FORTE)
  async function ocultarTodos() {
    const ok = await confirmar({
      titulo: "Ocultar TODOS",
      texto: "Isso vai ocultar todos os registros do dia. Deseja continuar?"
    });

    if (!ok) return;

    try {
      const response = await fetch(
        "http://localhost:8080/registros/ocultar-todos",
        { method: "PATCH" }
      );

      if (!response.ok) {
        erro("Erro ao ocultar todos");
        return;
      }

      setRegistros([]);
      sucesso("Todos os registros foram ocultados");

    } catch (err) {
      console.error(err);
      erro("Erro no servidor");
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

      {/* FUNDO */}
      <img src={fundo} className="absolute w-full h-full object-cover" />
      <div className="absolute w-full h-full backdrop-blur-sm bg-black/30"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">

        <div className="w-full max-w-lg bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl space-y-5">

          {/* HEADER */}
          <div className="flex flex-col items-center border-b pb-3">
            <img src={logo} className="w-14 mb-2" />
            <h1 className="text-xl font-bold">Registros</h1>
            <p className="text-xs text-gray-500">
              Check-ins e Checkouts do dia
            </p>
          </div>

          {/* BOTÃO */}
          <button
            onClick={ocultarTodos}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg w-full text-sm"
          >
            Ocultar todos
          </button>

          {/* LISTA */}
          <div className="space-y-6">

            {/* CHECKIN */}
            <div>
              <h2 className="text-xs font-semibold text-blue-600/80 mb-2 uppercase tracking-wide">
                📸 Check-ins
              </h2>

              {checkins.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">
                  Nenhum check-in
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

                  {checkins.map((r) => (
                    <div
                      key={r.id}
                      className="group bg-white/80 backdrop-blur rounded-lg p-2 shadow-sm text-center hover:shadow-md transition"
                    >
                      <img
                        src={r.foto}
                        onClick={() => setImagemAberta(r.foto)}
                        className="w-full h-20 object-cover rounded-md mb-1 cursor-pointer hover:scale-105 transition"
                      />

                      <p className="text-[10px] text-gray-500">
                        Posto {r.posto}
                      </p>

                      <p className="text-[10px] text-gray-400">
                        {r.dataHora}
                      </p>

                      <button
                        onClick={() => ocultarRegistro(r.id)}
                        className="text-[10px] text-red-500 opacity-0 group-hover:opacity-100 transition mt-1"
                      >
                        ocultar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CHECKOUT */}
            <div>
              <h2 className="text-xs font-semibold text-green-600/80 mb-2 uppercase tracking-wide">
                🚪 Checkouts
              </h2>

              {checkouts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">
                  Nenhum checkout
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

                  {checkouts.map((r) => (
                    <div
                      key={r.id}
                      className="group bg-white/80 backdrop-blur rounded-lg p-2 shadow-sm text-center hover:shadow-md transition"
                    >
                      <img
                        src={r.foto}
                        onClick={() => setImagemAberta(r.foto)}
                        className="w-full h-20 object-cover rounded-md mb-1 cursor-pointer hover:scale-105 transition"
                      />

                      <p className="text-[10px] text-gray-500">
                        Posto {r.posto}
                      </p>

                      <p className="text-[10px] text-gray-400">
                        {r.dataHora}
                      </p>

                      <button
                        onClick={() => ocultarRegistro(r.id)}
                        className="text-[10px] text-red-500 opacity-0 group-hover:opacity-100 transition mt-1"
                      >
                        ocultar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* MODAL */}
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