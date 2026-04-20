import { useState, useEffect } from "react";
import fundo from "../assets/fundo.jpg";
import logo from "../assets/Logo1.png";

import {
    loading,
    loadingSucesso,
    loadingErro,
    sucesso,
    erro,
    confirmar,
    aviso
} from "../utils/feedback";

export function AdminRelatorios() {
    const [relatorios, setRelatorios] = useState([]);

    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");

    async function carregarRelatorios() {
        try {
            const response = await fetch("http://localhost:8080/relatorios");

            if (!response.ok) throw new Error();

            const dados = await response.json();
            setRelatorios(dados);

        } catch (error) {
            console.error(error);
            erro("Erro ao carregar relatórios do servidor");
        }
        
    }

    useEffect(() => {
        carregarRelatorios();
    }, []);

    // 🔥 EXPORT POR PERÍODO
    async function exportarExcel() {
        if (!inicio || !fim) {
            aviso("Selecione o período primeiro!");
            return;
        }

        loading("Gerando relatório...");

        try {
            const response = await fetch(
                `http://localhost:8080/relatorios/export?inicio=${inicio}T00:00:00&fim=${fim}T23:59:59`
            );

            if (!response.ok) throw new Error();

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `relatorios_${inicio}_${fim}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            loadingSucesso("Download concluído!");

        } catch (err) {
            console.error(err);
            loadingErro("Erro ao baixar relatório");
        }
    }

    // 🔥 OCULTAR RELATÓRIO
    async function ocultarRelatorio(id) {
        const ok = await confirmar({
            titulo: "Ocultar relatório?",
            texto: "Esse relatório será removido da visualização."
        });

        if (!ok) return;

        try {
            const response = await fetch(
                `http://localhost:8080/relatorios/ocultar/${id}`,
                { method: "PATCH" }
            );

            if (!response.ok) {
                const text = await response.text();
                console.error("Erro backend:", text);
                erro("Erro ao ocultar relatório");
                return;
            }

            setRelatorios(prev => prev.filter(r => r.id !== id));
            sucesso("Relatório ocultado");

        } catch (err) {
            console.error("Erro fetch:", err);
            erro("Erro de conexão");
        }
    }

    // 🔥 OCULTAR TODOS
    async function ocultarTodos() {
        const ok = await confirmar({
            titulo: "Ocultar todos os relatórios?",
            texto: "Essa ação não pode ser desfeita."
        });

        if (!ok) return;

        try {
            const response = await fetch(
                "http://localhost:8080/relatorios/ocultar-todos",
                { method: "PATCH" }
            );

            if (!response.ok) {
                const text = await response.text();
                console.error("Erro backend:", text);
                erro("Erro ao ocultar relatórios");
                return;
            }

            setRelatorios([]);
            sucesso("Todos os relatórios foram ocultados");

        } catch (err) {
            console.error("Erro fetch:", err);
            erro("Erro de conexão");
        }
    }

    return (
        <div className="relative min-h-screen w-screen overflow-y-auto">

            {/* FUNDO */}
            <img src={fundo} className="absolute w-full h-full object-cover" alt="" />
            <div className="absolute w-full h-full backdrop-blur-sm bg-black/30"></div>

            <div className="relative z-10 flex items-center justify-center h-full px-4">

                <div className="w-full max-w-lg bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl space-y-5">

                    {/* HEADER */}
                    <div className="flex flex-col items-center border-b pb-3">
                        <img src={logo} className="w-16 mb-2" alt="" />
                        <h1 className="text-xl font-bold">Relatórios</h1>
                        <p className="text-xs text-gray-500">
                            Relatórios operacionais registrados
                        </p>
                    </div>

                    {/* SELEÇÃO DE PERÍODO */}
                    <div className="flex gap-2 mb-3">
                        <input
                            type="date"
                            value={inicio}
                            onChange={(e) => setInicio(e.target.value)}
                            className="border p-2 rounded w-full"
                        />

                        <input
                            type="date"
                            value={fim}
                            onChange={(e) => setFim(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    {/* BOTÕES */}
                    <div className="flex gap-2">
                        <button
                            onClick={exportarExcel}
                            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg w-full"
                        >
                            Exportar Excel
                        </button>

                        <button
                            onClick={ocultarTodos}
                            className="bg-red-700 hover:bg-red-800 text-white p-3 rounded-lg w-full"
                        >
                            Ocultar todos
                        </button>
                    </div>

                    {/* LISTA */}
                    <div className="space-y-3">
                        {relatorios.length === 0 ? (
                            <p className="text-center text-gray-500 text-sm">
                                Nenhum relatório encontrado
                            </p>
                        ) : (
                            relatorios.map((r) => (
                                <div key={r.id} className="bg-white rounded-xl p-3 shadow-sm">

                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <p className="font-semibold text-sm">
                                                {r.nomePosto || `Posto ${r.postoId}`}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {r.dataHora
                                                    ? new Date(r.dataHora).toLocaleString()
                                                    : "Sem data"}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => ocultarRelatorio(r.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                                        >
                                            Ocultar
                                        </button>
                                    </div>

                                    <table className="w-full text-sm border rounded-lg overflow-hidden">
                                        <thead>
                                            <tr className="bg-gray-100 text-gray-700">
                                                <th className="p-2 text-left">Período</th>
                                                <th className="p-2 text-center">Prevenções</th>
                                                <th className="p-2 text-center">Ataques</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr className="border-t">
                                                <td className="p-2">Manhã</td>
                                                <td className="text-center">{r.manhaPrevencoes}</td>
                                                <td className="text-center">{r.manhaAtaques}</td>
                                            </tr>

                                            <tr className="border-t">
                                                <td className="p-2">Tarde</td>
                                                <td className="text-center">{r.tardePrevencoes}</td>
                                                <td className="text-center">{r.tardeAtaques}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}