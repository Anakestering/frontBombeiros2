import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import fundo from "../assets/fundo.jpg";
import logo from "../assets/Logo1.png";

import { erro } from "../utils/feedback";

export function PostoAdmin() {
  const { id } = useParams();
  const tipo = localStorage.getItem("tipo");

  const [checkins, setCheckins] = useState([]);
  const [checkouts, setCheckouts] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [checkoutFinalizado, setCheckoutFinalizado] = useState(false);

  const carregando = useRef(false);

  // 🔥 BUSCAR DO BACKEND (SEGURO)
  async function carregarDados() {
    if (carregando.current) return;
    carregando.current = true;

    try {
      // =========================
      // REGISTROS
      // =========================
      const response = await fetch(
        `http://localhost:8080/registros/hoje/${id}`
      );

      if (!response.ok) throw new Error("Erro registros");

      const text = await response.text();
      const data = text ? JSON.parse(text) : [];

      const checkinList = data
        .filter(r => r.tipo === "CHECKIN")
        .map(r => ({
          foto: r.urlImagem,
          dataHora: new Date(r.dataHora).toLocaleString()
        }));

      const checkoutList = data
        .filter(r => r.tipo === "CHECKOUT")
        .map(r => ({
          foto: r.urlImagem,
          dataHora: new Date(r.dataHora).toLocaleString()
        }));

      setCheckins(checkinList);
      setCheckouts(checkoutList);
      setCheckoutFinalizado(checkoutList.length > 0);

      // =========================
      // RELATÓRIO
      // =========================
      const resRelatorio = await fetch(
        `http://localhost:8080/relatorios/hoje/${id}`
      );

      if (resRelatorio.ok) {
        const relText = await resRelatorio.text();
        const rel = relText ? JSON.parse(relText) : null;
        setRelatorio(rel);
      } else {
        setRelatorio(null);
      }

    } catch (err) {
      console.error("Erro ao carregar dados", err);
      erro("Erro ao carregar dados do posto");
    } finally {
      carregando.current = false;
    }
  }

  useEffect(() => {
    carregarDados();

    const interval = setInterval(() => {
      carregarDados();
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  if (tipo !== "admin") return <Navigate to="/postos" />;

  return (
    <BackgroundLayout>
      <div className="w-full max-w-lg bg-white/90 p-6 rounded-2xl shadow-2xl space-y-5">

        <Header titulo={`Posto ${id}`} />

        {checkins.length > 0 && (
          <StatusCard finalizado={checkoutFinalizado} />
        )}

        <Card titulo="Checkin">
          <ImageSection
            imagens={checkins}
            mensagemVazia="Nenhum checkin realizado"
          />
        </Card>

        <Card titulo="Relatório">
          <RelatorioSection relatorio={relatorio} />
        </Card>

        <Card titulo="Checkout">
          <ImageSection
            imagens={checkouts}
            mensagemVazia="Nenhum checkout realizado"
          />
        </Card>

      </div>
    </BackgroundLayout>
  );
}

/* =========================
   LAYOUT
========================= */
function BackgroundLayout({ children }) {
  return (
    <div className="relative min-h-screen w-screen overflow-y-auto">
      <img src={fundo} className="absolute w-full h-full object-cover" alt="" />
      <div className="absolute w-full h-full backdrop-blur-sm bg-black/30"></div>

      <div className="relative z-10 flex items-center justify-center h-full px-4">
        {children}
      </div>
    </div>
  );
}

/* =========================
   HEADER
========================= */
function Header({ titulo }) {
  return (
    <div className="flex flex-col items-center border-b pb-3">
      <img src={logo} className="w-16 mb-2" alt="logo" />
      <h1 className="text-xl font-bold">{titulo}</h1>
      <p className="text-xs text-gray-500">Informações do posto</p>
    </div>
  );
}

/* =========================
   CARD
========================= */
function Card({ titulo, children }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm space-y-2">
      <p className="font-semibold">{titulo}</p>
      {children}
    </div>
  );
}

/* =========================
   STATUS
========================= */
function StatusCard({ finalizado }) {
  return (
    <div
      className={`p-3 rounded-xl text-center font-semibold text-white ${
        finalizado ? "bg-green-500" : "bg-yellow-500"
      }`}
    >
      {finalizado ? "Finalizado ✅" : "Em andamento ⏳"}
    </div>
  );
}

/* =========================
   IMAGENS
========================= */
function ImageSection({ imagens, mensagemVazia }) {
  const [imagemSelecionada, setImagemSelecionada] = useState(null);

  return (
    <div>
      {imagens.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          {mensagemVazia}
        </p>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {imagens.map((img, i) => (
            <div key={i} className="text-center">
              <img
                src={img.foto}
                alt="Registro do posto"
                onClick={() => setImagemSelecionada(img.foto)}
                className="w-20 h-20 rounded-lg shadow cursor-pointer hover:scale-105 transition"
              />
              <p className="text-[10px] text-gray-500">{img.dataHora}</p>
            </div>
          ))}
        </div>
      )}

      {imagemSelecionada && (
        <div
          onClick={() => setImagemSelecionada(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <img
            src={imagemSelecionada}
            alt="Imagem ampliada do registro"
            className="max-w-[90%] max-h-[90%] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}

/* =========================
   RELATÓRIO
========================= */
function RelatorioSection({ relatorio }) {
  if (!relatorio) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        Nenhum relatório enviado
      </p>
    );
  }

  const {
    manhaPrevencoes = 0,
    manhaAtaques = 0,
    tardePrevencoes = 0,
    tardeAtaques = 0
  } = relatorio;

  return (
    <div className="space-y-3">
      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Período</th>
            <th className="p-2 text-center">Prevenções</th>
            <th className="p-2 text-center">Ataques de Água-viva</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="p-2">Manhã</td>
            <td className="text-center">{manhaPrevencoes}</td>
            <td className="text-center">{manhaAtaques}</td>
          </tr>

          <tr>
            <td className="p-2">Tarde</td>
            <td className="text-center">{tardePrevencoes}</td>
            <td className="text-center">{tardeAtaques}</td>
          </tr>
        </tbody>
      </table>

      <div className="bg-gray-100 rounded-lg p-2 text-sm">
        <p>
          <strong>Total Prevenções:</strong>{" "}
          {Number(manhaPrevencoes) + Number(tardePrevencoes)}
        </p>
        <p>
          <strong>Total ataques de água-viva:</strong>{" "}
          {Number(manhaAtaques) + Number(tardeAtaques)}
        </p>
      </div>
    </div>
  );
}