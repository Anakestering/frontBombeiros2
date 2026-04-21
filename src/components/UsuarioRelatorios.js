import { useState, useEffect } from "react";

// 🔥 feedback padronizado
import {
  sucesso,
  erro,
  aviso,
  loading,
  loadingSucesso,
  loadingErro,
  confirmar
} from "../utils/feedback"; // ajusta o caminho se precisar

export function RelatorioForm({ postoId, onSalvo }) {

  const [relatorio, setRelatorio] = useState({
    manhaPrevencoes: "",
    manhaAtaques: "",
    tardePrevencoes: "",
    tardeAtaques: ""
  });

  const [loadingState, setLoadingState] = useState(false);

  // ================= 🔥 CARREGAR =================
  async function carregarRelatorio() {
    try {
      const response = await fetch("http://localhost:8080/relatorios");

      if (!response.ok) throw new Error();

      const dados = await response.json();

      const relatorioPosto = dados
        .filter(r => r.postoId == postoId)
        .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))[0];

      if (relatorioPosto) {
        setRelatorio({
          manhaPrevencoes: relatorioPosto.manhaPrevencoes || "",
          manhaAtaques: relatorioPosto.manhaAtaques || "",
          tardePrevencoes: relatorioPosto.tardePrevencoes || "",
          tardeAtaques: relatorioPosto.tardeAtaques || ""
        });
      }

    } catch (error) {
      console.error(error);
      erro("Erro ao carregar relatório");
    }
  }

  useEffect(() => {
    carregarRelatorio();
  }, [postoId]);

  // ================= INPUT =================
  function handleChange(e) {
    const { name, value } = e.target;
    setRelatorio((prev) => ({ ...prev, [name]: value }));
  }

  function relatorioPreenchido() {
    return (
      relatorio.manhaPrevencoes !== "" &&
      relatorio.manhaAtaques !== "" &&
      relatorio.tardePrevencoes !== "" &&
      relatorio.tardeAtaques !== ""
    );
  }

  // ================= SALVAR =================
  async function salvarRelatorio() {

    if (!relatorioPreenchido()) {
      aviso("Preencha todos os campos do relatório");
      return;
    }

    const ok = await confirmar({
      titulo: "Salvar relatório?",
      texto: "Confirma o envio dos dados?",
      confirmText: "Salvar",
      cancelText: "Cancelar"
    });

    if (!ok) return;

    if (loadingState) return;
    setLoadingState(true);

    loading("Salvando relatório...");

    const dados = {
      postoId: Number(postoId),
      manhaPrevencoes: Number(relatorio.manhaPrevencoes),
      manhaAtaques: Number(relatorio.manhaAtaques),
      tardePrevencoes: Number(relatorio.tardePrevencoes),
      tardeAtaques: Number(relatorio.tardeAtaques)
    };

    try {
      const response = await fetch("http://localhost:8080/relatorios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });

      const resultado = await response.json();

      if (!response.ok) throw new Error();

      loadingSucesso("Relatório salvo com sucesso!");

      if (onSalvo) onSalvo(resultado);

    } catch (err) {
      console.error(err);
      loadingErro("Não foi possível salvar o relatório");
    } finally {
      setLoadingState(false);
    }
  }

  // ================= UI =================
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm space-y-2">
      <p className="font-semibold">Relatório</p>

      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Período</th>
            <th className="p-2 text-center">Prevenções</th>
            <th className="p-2 text-center">Lesões Água-viva</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-t">
            <td className="p-2">Manhã</td>
            <td className="p-2">
              <input
                type="number"
                name="manhaPrevencoes"
                value={relatorio.manhaPrevencoes}
                onChange={handleChange}
                className="w-full text-center border rounded p-1"
              />
            </td>
            <td className="p-2">
              <input
                type="number"
                name="manhaAtaques"
                value={relatorio.manhaAtaques}
                onChange={handleChange}
                className="w-full text-center border rounded p-1"
              />
            </td>
          </tr>

          <tr className="border-t">
            <td className="p-2">Tarde</td>
            <td className="p-2">
              <input
                type="number"
                name="tardePrevencoes"
                value={relatorio.tardePrevencoes}
                onChange={handleChange}
                className="w-full text-center border rounded p-1"
              />
            </td>
            <td className="p-2">
              <input
                type="number"
                name="tardeAtaques"
                value={relatorio.tardeAtaques}
                onChange={handleChange}
                className="w-full text-center border rounded p-1"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={salvarRelatorio}
        disabled={loadingState}
        className={`p-2 rounded-lg w-full text-white ${
          loadingState ? "bg-gray-400" : "bg-blue-600"
        }`}
      >
        {loadingState ? "Salvando..." : "Salvar Relatório"}
      </button>
    </div>
  );
}