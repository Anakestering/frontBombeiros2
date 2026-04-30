import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/Logo1.png";
import fundo from "../assets/fundo.jpg";

export function Postos() {
    const navigate = useNavigate();

    const tipo = localStorage.getItem("tipo");
    const [postos, setPostos] = useState([]);

    function acessarPosto(id) {
        navigate(tipo === "admin" ? `/admin/posto/${id}` : `/posto/${id}`);
    }

    useEffect(() => {
        fetch("http://localhost:8080/postos/ordenado")
            .then((res) => res.json())
            .then((data) => setPostos(data))
            .catch((error) => console.error("Erro ao buscar postos:", error));
    }, []);

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
                            onClick={acessarPosto}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

//FUNDO
function Background() {
    return (
        <>
            <img src={fundo} className="absolute w-full h-full object-cover" />
            <div className="absolute w-full h-full backdrop-blur-sm bg-black/30"></div>
        </>
    );
}


function Header({ tipo, navigate }) {
    return (
        <div className="w-full max-w-sm mx-auto flex items-center justify-between p-4">
            <img src={logo} className="w-14 h-14 drop-shadow" />

            {tipo === "admin" && (
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate("/admin/registros")}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                    >
                        Registros
                    </button>

                    <button
                        onClick={() => navigate("/admin/relatorios")}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                    >
                        Relatórios
                    </button>
                </div>
            )}
        </div>
    );
}


function PostoCard({ posto, onClick }) {
    return (
        <div
            onClick={() => onClick(posto.id)}
            className="p-3 rounded-xl shadow cursor-pointer active:scale-95 transition flex items-center justify-between max-w-sm mx-auto bg-white/90 text-gray-800"
        >
            <div>
                <h2 className="text-lg font-medium">{posto.nome}</h2>
            </div>

            <div className="text-xl">➡️</div>
        </div>
    );
}