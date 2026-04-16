import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import fundo from "../assets/fundo.jpg";
import logo from "../assets/Logo1.png";

import { Card } from "../components/ui/Card";
import { Botao } from "../components/ui/Botao";
import { PreviewFoto } from "../components/ui/PreviewFoto";
import { ListaFotos } from "../components/ui/ListarFotos";
import { RelatorioForm } from "../components/UsuarioRelatorios";

export function PostoUsuario() {
  const { id } = useParams();

  const inputCheckinRef = useRef(null);
  const inputCheckoutRef = useRef(null);

  const [checkinRegistros, setCheckinRegistros] = useState([]);
  const [fotoTempCheckin, setFotoTempCheckin] = useState(null);

  const [checkoutRegistros, setCheckoutRegistros] = useState([]);
  const [fotoTempCheckout, setFotoTempCheckout] = useState(null);

  const [checkoutFinalizado, setCheckoutFinalizado] = useState(false);
  const [imagemAberta, setImagemAberta] = useState(null);

  // 🔥 CONTROLE DO RELATÓRIO
  const [relatorioEnviado, setRelatorioEnviado] = useState(false);

  // ================= CHECK-IN =================

  function capturarFotoCheckin(e) {
    const file = e.target.files[0];
    if (!file) return;

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

      setFotoTempCheckin(compressedBase64);

      if (inputCheckinRef.current) inputCheckinRef.current.value = "";
    };

    reader.readAsDataURL(file);
  }

  function removerFotoTempCheckin() {
    setFotoTempCheckin(null);
    if (inputCheckinRef.current) inputCheckinRef.current.value = "";
  }

  async function finalizarCheckin() {
    if (!fotoTempCheckin) return alert("Tire uma foto!");
    if (checkinRegistros.length >= 3) return alert("Máximo 3 check-ins!");

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

      const text = await response.text();

      if (!response.ok) throw new Error(text);

      const novo = JSON.parse(text);

      setCheckinRegistros((prev) => [
        ...prev,
        {
          foto: novo.urlImagem,
          dataHora: new Date(novo.dataHora).toLocaleString()
        }
      ]);

      setFotoTempCheckin(null);

      alert("Check-in enviado!");

    } catch (err) {
      console.error(err);
      alert("Erro no check-in");
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

    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoTempCheckout(reader.result);
      if (inputCheckoutRef.current) inputCheckoutRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  function removerFotoTempCheckout() {
    setFotoTempCheckout(null);
    if (inputCheckoutRef.current) inputCheckoutRef.current.value = "";
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

  function finalizarCheckout() {
    if (!relatorioEnviado) return alert("Envie o relatório!");
    if (checkoutRegistros.length === 0) return alert("Adicione uma foto!");

    setCheckoutFinalizado(true);
    alert("Checkout finalizado!");
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

          {/* CHECK-IN */}
          <Card titulo="📸 Check-in">
            <Botao onClick={() => inputCheckinRef.current.click()} cor="azul">
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

          {/* RELATÓRIO */}
          <RelatorioForm
            postoId={id}
            onSalvo={() => setRelatorioEnviado(true)}
          />

          {/* CHECKOUT */}
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

            <Botao onClick={finalizarCheckout} cor="verde">
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
        <div onClick={() => setImagemAberta(null)} className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <img src={imagemAberta} className="max-w-[90%] max-h-[90%] rounded-xl" alt="" />
        </div>
      )}
    </div>
  );
}