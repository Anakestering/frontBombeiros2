import { useState, useEffect } from "react";
import fundo from "../assets/fundo.jpg";
import logo from "../assets/Logo1.png";


export function AdminRegistros() {
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    const todos = [];

    for (let i = 1; i <= 21; i++) {
      const dados = JSON.parse(localStorage.getItem(`posto_${i}`));

      if (!dados) continue;

      (dados.checkinRegistros || []).forEach(r => {
        todos.push({ ...r, tipo: "checkin", posto: i });
      });

      (dados.checkoutRegistros || []).forEach(r => {
        todos.push({ ...r, tipo: "checkout", posto: i });
      });
    }

    setRegistros(todos);
  }, []);

  function limparFotos() {
    for (let i = 1; i <= 21; i++) {
      const dados = JSON.parse(localStorage.getItem(`posto_${i}`));
      if (!dados) continue;

      dados.checkinRegistros = [];
      dados.checkoutRegistros = [];

      localStorage.setItem(`posto_${i}`, JSON.stringify(dados));
    }

    alert("Fotos apagadas!");
    window.location.reload();
  }

  return (
  <div className="relative h-screen w-screen overflow-hidden">

    {/* 🌫️ FUNDO */}
    <img src={fundo} className="absolute w-full h-full object-cover" />
    <div className="absolute w-full h-full backdrop-blur-sm bg-black/30"></div>

    <div className="relative z-10 flex items-center justify-center h-full px-4">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl space-y-5">

        {/* 🔝 HEADER */}
        <div className="flex flex-col items-center border-b pb-3">
          <img src={logo} className="w-16 mb-2" />
          <h1 className="text-xl font-bold">Registros</h1>
          <p className="text-xs text-gray-500">Check-ins e checkouts realizados</p>
        </div>

        {/* 🗑️ AÇÃO */}
        <button
          onClick={limparFotos}
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg w-full transition font-medium"
        >
          Apagar todas as fotos
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
                    className="w-full h-24 object-cover rounded-lg mb-1 cursor-pointer hover:scale-105 transition"
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
  </div>
);
}