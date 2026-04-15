import { useState, useEffect } from "react";
import fundo from "../assets/fundo.jpg";
import logo from "../assets/Logo1.png";

export function AdminRelatorios() {
    const [relatorios, setRelatorios] = useState([]);

    function carregarRelatorios() {
        const lista = [];

        for (let i = 1; i <= 21; i++) {
            const dados = JSON.parse(localStorage.getItem(`posto_${i}`));

            if (!dados?.relatorio) continue;

            const r = dados.relatorio;

            // só entra se tiver algo preenchido
            if (
                r.manhaPrevencoes ||
                r.manhaAtaques ||
                r.tardePrevencoes ||
                r.tardeAtaques
            ) {
                lista.push({
                    posto: i,
                    ...r
                });
            }
        }

        setRelatorios(lista);
    }

    useEffect(() => {
        carregarRelatorios();
    }, []);

    function exportarExcel() {
        let conteudo = `
        <table>
            <tr>
                <th>Posto</th>
                <th>Manhã Prev</th>
                <th>Manhã Ataques</th>
                <th>Tarde Prev</th>
                <th>Tarde Ataques</th>
            </tr>
        `;

        relatorios.forEach(r => {
            conteudo += `
                <tr>
                    <td>${r.posto}</td>
                    <td>${r.manhaPrevencoes}</td>
                    <td>${r.manhaAtaques}</td>
                    <td>${r.tardePrevencoes}</td>
                    <td>${r.tardeAtaques}</td>
                </tr>
            `;
        });

        conteudo += `</table>`;

        const blob = new Blob([conteudo], { type: "application/vnd.ms-excel" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "relatorios.xls";
        a.click();
    }

    function limparRelatorios() {
        if (!window.confirm("Tem certeza que deseja apagar todos os relatórios?")) return;

        for (let i = 1; i <= 21; i++) {
            const dados = JSON.parse(localStorage.getItem(`posto_${i}`));

            if (dados) {
                dados.relatorio = {
                    manhaPrevencoes: "",
                    manhaAtaques: "",
                    tardePrevencoes: "",
                    tardeAtaques: ""
                };

                localStorage.setItem(`posto_${i}`, JSON.stringify(dados));
            }
        }

        // 🔥 RECARREGA NA TELA (isso resolve seu bug)
        carregarRelatorios();

        alert("Relatórios apagados!");
    }

    return (
        <div className="relative min-h-screen w-screen overflow-y-auto">

            {/* FUNDO */}
            <img src={fundo} className="absolute w-full h-full object-cover" />
            <div className="absolute w-full h-full backdrop-blur-sm bg-black/30"></div>

            <div className="relative z-10 flex items-center justify-center h-full px-4">

                <div className="w-full max-w-lg bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl space-y-5">

                    {/* HEADER */}
                    <div className="flex flex-col items-center border-b pb-3">
                        <img src={logo} className="w-16 mb-2" />
                        <h1 className="text-xl font-bold">Relatórios</h1>
                        <p className="text-xs text-gray-500">
                            Relatórios operacionais registrados
                        </p>
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
                            onClick={limparRelatorios}
                            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg w-full"
                        >
                            Apagar
                        </button>
                    </div>

                    {/* LISTA */}
                    <div className="space-y-3">
                        {relatorios.length === 0 ? (
                            <p className="text-center text-gray-500 text-sm">
                                Nenhum relatório encontrado
                            </p>
                        ) : (
                            relatorios.map((r, i) => (
                                <div key={i} className="bg-white rounded-xl p-3 shadow-sm">

                                    <p className="font-semibold text-sm mb-2">
                                        Posto {r.posto}
                                    </p>

                                    {/* TABELA ESTILO PROFISSIONAL */}
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