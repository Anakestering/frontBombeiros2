import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import fundo from "../assets/fundo.jpg";
import logo from "../assets/Logo1.png";

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

  const [relatorio, setRelatorio] = useState({
    manhaPrevencoes: "",
    manhaAtaques: "",
    tardePrevencoes: "",
    tardeAtaques: ""
  });

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem(`posto_${id}`));

    if (dados) {
      setCheckinRegistros(dados.checkinRegistros || []);
      setCheckoutRegistros(dados.checkoutRegistros || []);
      setRelatorio(dados.relatorio || relatorio);
      setCheckoutFinalizado(dados.checkoutFinalizado || false);
    }
  }, [id]);

  function salvar(dadosAtualizados) {
    localStorage.setItem(`posto_${id}`, JSON.stringify(dadosAtualizados));
  }

  function relatorioPreenchido() {
    return (
      relatorio.manhaPrevencoes !== "" &&
      relatorio.manhaAtaques !== "" &&
      relatorio.tardePrevencoes !== "" &&
      relatorio.tardeAtaques !== ""
    );
  }

  // ================= CHECK-IN =================

  function capturarFotoCheckin(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoTempCheckin(reader.result);
      if (inputCheckinRef.current) inputCheckinRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  function removerFotoTempCheckin() {
    setFotoTempCheckin(null);
    if (inputCheckinRef.current) inputCheckinRef.current.value = "";
  }

  function finalizarCheckin() {
    if (!fotoTempCheckin) return alert("Tire uma foto primeiro!");
    if (checkinRegistros.length >= 3) return alert("Máximo de 3 check-ins!");

    const novo = {
      foto: fotoTempCheckin,
      dataHora: new Date().toLocaleString(),
      postoId: id
    };

    const novos = [...checkinRegistros, novo];

    setCheckinRegistros(novos);
    setFotoTempCheckin(null);

    salvar({ checkinRegistros: novos, checkoutRegistros, relatorio, checkoutFinalizado });

    alert("Check-in enviado!");
  }

  // ================= CHECKOUT =================

  function capturarFotoCheckout(e) {
    const file = e.target.files[0];
    if (!file) return;

   if (checkinRegistros.length === 0) {
    alert("Faça pelo menos 1 check-in antes!");
    return;
  }

  if (!relatorioPreenchido()) {
    alert("Preencha o relatório antes!");
    return;
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
      dataHora: new Date().toLocaleString(),
      postoId: id
    };

    const novos = [...checkoutRegistros, novo];

    setCheckoutRegistros(novos);
    setFotoTempCheckout(null);

    salvar({ checkinRegistros, checkoutRegistros: novos, relatorio, checkoutFinalizado });
  }

  function finalizarCheckout() {
    if (!relatorioPreenchido()) return alert("Preencha o relatório!");
    if (checkoutRegistros.length === 0) return alert("Adicione pelo menos 1 foto!");

    setCheckoutFinalizado(true);

    salvar({
      checkinRegistros,
      checkoutRegistros,
      relatorio,
      checkoutFinalizado: true
    });

    alert("Checkout finalizado!");
  }

  // ================= RELATÓRIO =================

  function handleChange(e) {
    const { name, value } = e.target;
    setRelatorio((prev) => ({ ...prev, [name]: value }));
  }

  function salvarRelatorio() {
  if (!relatorioPreenchido()) {
    return alert("Preencha todos os campos do relatório antes de salvar!");
  }

  const confirmar = window.confirm("Tem certeza que deseja salvar o relatório?");
  if (!confirmar) return;

  salvar({ checkinRegistros, checkoutRegistros, relatorio, checkoutFinalizado });

  alert("Relatório salvo!");
}

function getHoje() {
  return new Date().toISOString().split("T")[0];
}

function salvar(dadosAtualizados) {
  const dadosComData = {
    ...dadosAtualizados,
    ultimaAtualizacao: getHoje()
  };

  localStorage.setItem(`posto_${id}`, JSON.stringify(dadosComData));
}

  // ================= UI =================

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto">

      {/* 🌫️ FUNDO */}
      <img src={fundo} className="absolute w-full h-full object-cover" />
      <div className="absolute w-full h-full backdrop-blur-sm bg-black/30"></div>

      <div className="relative z-10 flex justify-center items-center h-full px-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-2xl space-y-4">

          {/* HEADER */}
          <div className="flex flex-col items-center">
            <img src={logo} className="w-16 mb-2" />
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
          <Card titulo="📝 Relatório">
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
                  <td className="p-2 font-medium">Manhã</td>

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
                  <td className="p-2 font-medium">Tarde</td>

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

            <Botao onClick={salvarRelatorio} cor="azul">
              Salvar Relatório
            </Botao>
          </Card>

          {/* CHECKOUT */}
          <Card titulo="🚪 Checkout">
            <Botao
              onClick={() => inputCheckoutRef.current.click()}
              cor={relatorioPreenchido() ? "verde" : "cinza"}
              disabled={!relatorioPreenchido()}
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
              <p className="text-green-600 text-center font-semibold">Finalizado ✅</p>
            )}
          </Card>
        </div>
      </div>

      {/* MODAL */}
      {imagemAberta && (
        <div onClick={() => setImagemAberta(null)} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <img src={imagemAberta} className="max-w-[90%] max-h-[90%] rounded-xl" />
        </div>
      )}
    </div>
  );
}

/* COMPONENTES REUTILIZÁVEIS */

function Card({ titulo, children }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm space-y-2">
      <p className="font-semibold">{titulo}</p>
      {children}
    </div>
  );
}

function Botao({ children, onClick, cor, disabled }) {
  const cores = {
    azul: "bg-blue-600 hover:bg-blue-700 text-white",
    verde: "bg-green-600 hover:bg-green-700 text-white",
    cinza: "bg-gray-400 text-white"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg w-full transition ${cores[cor]}`}
    >
      {children}
    </button>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <input {...props} className="w-full border p-2 rounded-lg text-sm" />
    </div>
  );
}

function PreviewFoto({ foto, onClick, onRemover, onSalvar, salvarLabel }) {
  if (!foto) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <img src={foto} onClick={onClick} className="w-40 h-40 rounded-lg cursor-pointer shadow" />
      <div className="flex gap-2">
        <button onClick={onRemover} className="bg-red-500 px-3 py-1 text-white rounded">Apagar</button>
        <button onClick={onSalvar} className="bg-blue-600 px-3 py-1 text-white rounded">{salvarLabel}</button>
      </div>
    </div>
  );
}

function ListaFotos({ lista, setImagemAberta }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {lista.map((item, i) => (
        <div key={i} className="text-center">
          <img
            src={item.foto}
            onClick={() => setImagemAberta(item.foto)}
            className="w-20 h-20 rounded-lg shadow cursor-pointer"
          />
          <p className="text-xs text-gray-500">{item.dataHora}</p>
        </div>
      ))}
    </div>
  );
}