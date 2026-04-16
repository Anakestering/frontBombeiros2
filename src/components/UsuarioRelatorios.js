import { useState } from "react";

export function RelatorioForm({ postoId, onSalvo }) {

    const [relatorio, setRelatorio] = useState({
        manhaPrevencoes: "",
        manhaAtaques: "",
        tardePrevencoes: "",
        tardeAtaques: ""
    });

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

    async function salvarRelatorio() {
        if (!relatorioPreenchido()) {
            return alert("Preencha todos os campos!");
        }

        const confirmar = window.confirm("Salvar relatório?");
        if (!confirmar) return;

        // 🔥 CONVERSÃO PRO BACKEND
        const dados = {
            postoId: Number(postoId),

            manhaPrevencoes: Number(relatorio.manhaPrevencoes),
            manhaAtaques: Number(relatorio.manhaAtaques),

            tardePrevencoes: Number(relatorio.tardePrevencoes),
            tardeAtaques: Number(relatorio.tardeAtaques)
        };

        try {

            console.log("ENVIANDO:", dados);
            const response = await fetch("http://localhost:8080/relatorios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const resultado = await response.json();

            console.log("RESPOSTA:", resultado);

            if (!response.ok) {
                console.error("Erro backend:", resultado);
                throw new Error(resultado);
            }



            alert("Relatório salvo no banco!");

            if (onSalvo) onSalvo(resultado);

        } catch (err) {
            console.error(err);
            alert("Erro ao salvar relatório");
        }
    }

    return (
        <div className="bg-white rounded-xl p-3 shadow-sm space-y-2">
            <p className="font-semibold">📝 Relatório</p>

            <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 text-left">Período</th>
                        <th className="p-2 text-center">Prevenções</th>
                        <th className="p-2 text-center">Ataques</th>
                    </tr>
                </thead>

                <tbody>
                    <tr className="border-t">
                        <td className="p-2">Manhã</td>
                        <td className="p-2">
                            <input type="number" name="manhaPrevencoes" value={relatorio.manhaPrevencoes} onChange={handleChange} className="w-full text-center border rounded p-1" />
                        </td>
                        <td className="p-2">
                            <input type="number" name="manhaAtaques" value={relatorio.manhaAtaques} onChange={handleChange} className="w-full text-center border rounded p-1" />
                        </td>
                    </tr>

                    <tr className="border-t">
                        <td className="p-2">Tarde</td>
                        <td className="p-2">
                            <input type="number" name="tardePrevencoes" value={relatorio.tardePrevencoes} onChange={handleChange} className="w-full text-center border rounded p-1" />
                        </td>
                        <td className="p-2">
                            <input type="number" name="tardeAtaques" value={relatorio.tardeAtaques} onChange={handleChange} className="w-full text-center border rounded p-1" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <button
                onClick={salvarRelatorio}
                className="bg-blue-600 text-white p-2 rounded-lg w-full"
            >
                Salvar Relatório
            </button>
        </div>
    );
}