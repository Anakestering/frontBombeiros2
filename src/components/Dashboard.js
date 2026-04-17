import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import fundo from "../assets/fundo.jpg";
import logo from "../assets/Logo1.png";
import toast from "react-hot-toast";

import { Card } from "../components/ui/Card";
import { Botao } from "../components/ui/Botao";
import { PreviewFoto } from "../components/ui/PreviewFoto";
import { ListaFotos } from "../components/ui/ListarFotos";
import { RelatorioForm } from "../components/UsuarioRelatorios";

export function PostoUsuario() {
  const { id } = useParams();

  const inputCheckinRef = useRef(null);
  const inputCheckoutRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [checkinRegistros, setCheckinRegistros] = useState([]);
  const [fotoTempCheckin, setFotoTempCheckin] = useState(null);

  const [checkoutRegistros, setCheckoutRegistros] = useState([]);
  const [fotoTempCheckout, setFotoTempCheckout] = useState(null);

  const [checkoutFinalizado, setCheckoutFinalizado] = useState(false);
  const [imagemAberta, setImagemAberta] = useState(null);

  const [relatorioEnviado, setRelatorioEnviado] = useState(false);

  // ================= 🔥 CARREGAR DO BACKEND =================
  async function carregarRegistros() {
    try {
      const response = await fetch(`http://localhost:8080/registros/hoje/${id}`);
      if (!response.ok) throw new Error("Erro ao buscar registros");
      const data = await response.json();



      const checkins = data
        .filter(r => r.tipo === "CHECKIN")
        .map(r => ({
          foto: r.urlImagem,
          dataHora: new Date(r.dataHora).toLocaleString()
        }));

      const checkouts = data
        .filter(r => r.tipo === "CHECKOUT")
        .map(r => ({
          foto: r.urlImagem,
          dataHora: new Date(r.dataHora).toLocaleString()
        }));



      setCheckinRegistros(checkins);
      setCheckoutRegistros(checkouts);

      // ================= 🔥 NOVO: VERIFICAR RELATÓRIO =================
      try {
        const responseRelatorio = await fetch(`http://localhost:8080/relatorios/hoje/${id}`);
        if (responseRelatorio.ok) {
          const relatorio = await responseRelatorio.json();
          setRelatorioEnviado(!!(relatorio && relatorio.id));
        } else {
          setRelatorioEnviado(false);
        }
      } catch (err) {
        console.warn("Relatório não encontrado ou erro ao buscar");
      }

    } catch (err) {
      console.error("Erro ao carregar registros", err);
    }
  }

  useEffect(() => {
    carregarRegistros();
  }, [id]);


  // ================= 📸 FUNÇÃO GENÉRICA =================
  function processarImagem(file, callback) {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const MAX_WIDTH = 800;
      const scale = MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

      callback(compressedBase64);
    };

    reader.readAsDataURL(file);
  }

  // ================= CHECK-IN =================

  function capturarFotoCheckin(e) {
    const file = e.target.files[0];
    if (!file) return;

    processarImagem(file, (img) => {
      setFotoTempCheckin(img);
      if (inputCheckinRef.current) inputCheckinRef.current.value = "";
    });
  }

  function removerFotoTempCheckin() {
    setFotoTempCheckin(null);
  }

  async function finalizarCheckin() {
  if (!fotoTempCheckin) return alert("Tire uma foto!");
  if (checkinRegistros.length >= 3) return alert("Máximo 3 check-ins!");

  if (loading) return;
  setLoading(true);

  try {
    const response = await fetch("http://localhost:8080/registros", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        postoId: Number(id),
        tipo: "CHECKIN",
        urlImagem: fotoTempCheckin
      })
    });

    if (!response.ok) throw new Error(await response.text());

    await carregarRegistros();
    setFotoTempCheckin(null);

    alert("Check-in enviado!");

  } catch (err) {
    console.error(err);
    alert("Erro no check-in");
  } finally {
    setLoading(false); // ✅ AQUI é o lugar certo
  }
}
   

  // ================= CHECKOUT =================

  function capturarFotoCheckout(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (checkinRegistros.length === 0) {
      return alert("Faça pelo menos 1 check-in!");
    }

    if (!relatorioEnviado) {
      return alert("Envie o relatório primeiro!");
    }

    processarImagem(file, (img) => {
      setFotoTempCheckout(img);
      if (inputCheckoutRef.current) inputCheckoutRef.current.value = "";
    });
  }

  function removerFotoTempCheckout() {
    setFotoTempCheckout(null);
  }

  function salvarFotoCheckout() {
    if (!fotoTempCheckout) return alert("Tire uma foto!");
    if (checkoutRegistros.length >= 3) return alert("Máximo 3 fotos!");

    const novo = {
      foto: fotoTempCheckout,
      dataHora: new Date().toLocaleString()
    };

    setCheckoutRegistros((prev) => [...prev, novo]);
    setFotoTempCheckout(null);
  }

  async function finalizarCheckout() {
    if (!relatorioEnviado) return alert("Envie o relatório!");
    if (checkoutRegistros.length === 0) return alert("Adicione uma foto!");

    try {
      for (const foto of checkoutRegistros) {
        const response = await fetch("http://localhost:8080/registros", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            postoId: Number(id),
            tipo: "CHECKOUT",
            urlImagem: foto.foto
          })
        });

        if (!response.ok) throw new Error(await response.text());
      }

      await carregarRegistros();
      setCheckoutFinalizado(true);
      setCheckoutRegistros([]);
      setCheckinRegistros([]);
      alert("Checkout finalizado!");

    } catch (err) {
      console.error(err);
      alert("Erro no checkout");
    }
  }

  // ================= UI =================
  
  return (
    <div className="relative min-h-screen w-screen overflow-y-auto">
      <img src={fundo} className="absolute w-full h-full object-cover" alt="" />
      <div className="absolute w-full h-full backdrop-blur-sm bg-black/30"></div>

      <div className="relative z-10 flex justify-center items-center h-full px-4">
        <div className="w-full max-w-md bg-white/90 p-5 rounded-2xl shadow-2xl space-y-4">

          <div className="flex flex-col items-center">
            <img src={logo} className="w-16 mb-2" alt="" />
            <h1 className="text-xl font-bold">Posto {id}</h1>
          </div>

          <Card titulo="📸 Check-in">
            <Botao  disabled={loading}  onClick={() => inputCheckinRef.current.click()} cor="azul">
              Tirar Foto
            </Botao>

            <input
              ref={inputCheckinRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={capturarFotoCheckin}
            />

            <PreviewFoto
              foto={fotoTempCheckin}
              onClick={() => setImagemAberta(fotoTempCheckin)}
              onRemover={removerFotoTempCheckin}
              onSalvar={finalizarCheckin}
              salvarLabel="Enviar"
            />

            <ListaFotos lista={checkinRegistros} setImagemAberta={setImagemAberta} />
          </Card>

          <RelatorioForm
            postoId={id}
            onSalvo={() => setRelatorioEnviado(true)}
          />

          <Card titulo="🚪 Checkout">
            <Botao
              onClick={() => inputCheckoutRef.current.click()}
              cor={relatorioEnviado ? "verde" : "cinza"}
              disabled={!relatorioEnviado}
            >
              Tirar Foto
            </Botao>

            <input
              ref={inputCheckoutRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={capturarFotoCheckout}
            />

            <PreviewFoto
              foto={fotoTempCheckout}
              onClick={() => setImagemAberta(fotoTempCheckout)}
              onRemover={removerFotoTempCheckout}
              onSalvar={salvarFotoCheckout}
              salvarLabel="Salvar"
            />

            <ListaFotos lista={checkoutRegistros} setImagemAberta={setImagemAberta} />

            <Botao disabled={loading} onClick={finalizarCheckout} cor="verde">
              Finalizar Checkout
            </Botao>

            {checkoutFinalizado && (
              <p className="text-green-600 text-center font-semibold">
                Finalizado ✅
              </p>
            )}
          </Card>
        </div>
      </div>

      {imagemAberta && (
        <div
          onClick={() => setImagemAberta(null)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
        >
          <img src={imagemAberta} className="max-w-[90%] max-h-[90%] rounded-xl" alt="" />
        </div>
      )}
    </div>
  );
}