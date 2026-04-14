import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import logo from "../assets/Logo1.png";
import fundo from "../assets/fundo.jpg";

export function Postos() {
    const navigate = useNavigate();
    const tipo = localStorage.getItem("tipo");

    const [statusPostos, setStatusPostos] = useState({});

    const postos = useMemo(
        () =>
            Array.from({ length: 21 }, (_, i) => ({
                id: i + 1,
                nome: `Posto ${i + 1}`
            })),
        []
    );

    function acessarPosto(id) {
        navigate(tipo === "admin" ? `/admin/posto/${id}` : `/posto/${id}`);
    }

    useEffect(() => {
        const carregarStatus = () => {
            try {
                const novosStatus = {};

                postos.forEach(({ id }) => {
                    const dados = JSON.parse(localStorage.getItem(`posto_${id}`));
                    novosStatus[id] = getStatus(dados);
                });

                setStatusPostos(novosStatus);
            } catch (error) {
                console.error("Erro ao carregar status:", error);
            }
        };

        carregarStatus();

        const intervalo = setInterval(carregarStatus, 1500);
        return () => clearInterval(intervalo);
    }, [postos]);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <Background />

            <div className="relative z-10 flex flex-col h-full">

                <Header tipo={tipo} navigate={navigate} />

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                    {postos.map((posto) => (
                        <PostoCard
                            key={posto.id}
                            posto={posto}
                            status={statusPostos[posto.id]}
                            onClick={acessarPosto}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* 🔥 LÓGICA */
function getStatus(dados) {
    if (!dados) return "vermelho";

    if (dados.checkoutFinalizado) return "verde";

    if ((dados.checkinRegistros || []).length > 0) return "amarelo";

    return "vermelho";
}

/* 🌫️ FUNDO */
function Background() {
    return (
        <>
            <img
                src={fundo}
                alt="Fundo"
                className="absolute w-full h-full object-cover"
            />
            <div className="absolute w-full h-full backdrop-blur-sm bg-black/30"></div>
        </>
    );
}

/* 🔝 HEADER ALINHADO COM OS CARDS */
function Header({ tipo, navigate }) {
    return (
        <div className="w-full max-w-sm mx-auto flex items-center justify-between p-4">

            {/* Logo */}
            <img src={logo} alt="Logo" className="w-14 h-14 drop-shadow" />

            {/* Botões admin */}
            {tipo === "admin" && (
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate("/admin/registros")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition"
                    >
                        Registros
                    </button>

                    <button
                        onClick={() => navigate("/admin/relatorios")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition"
                    >
                        Relatórios
                    </button>
                </div>
            )}
        </div>
    );
}

/* 📦 CARD */
function PostoCard({ posto, status = "vermelho", onClick }) {
    const config = getStatusConfig(status);

    return (
        <div
            onClick={() => onClick(posto.id)}
            className={`p-3 rounded-xl shadow cursor-pointer active:scale-95 transition 
            flex items-center justify-between max-w-sm mx-auto ${config.bg}`}
        >
            <div>
                <h2 className="text-lg font-medium">{posto.nome}</h2>
                <p className="text-sm">{config.label}</p>
            </div>

            <div className="text-xl">{config.icon}</div>
        </div>
    );
}

/* 🎨 STATUS */
function getStatusConfig(status) {
    const map = {
        verde: {
            bg: "bg-green-500 text-white",
            label: "Finalizado",
            icon: "✅"
        },
        amarelo: {
            bg: "bg-yellow-400 text-black",
            label: "Em andamento",
            icon: "⏳"
        },
        vermelho: {
            bg: "bg-white/90 text-gray-800",
            label: "Não iniciado",
            icon: "⚠️"
        }
    };

    return map[status] || map.vermelho;
}