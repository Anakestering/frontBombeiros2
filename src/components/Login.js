import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo1.png";
import fundo from "../assets/fundo.jpg";
//import toast from "react-hot-toast";

const USUARIOS = {
  admin: { senha: "123", tipo: "admin" },
  usuario: { senha: "123", tipo: "usuario" }
};

export function Login() {
  const [form, setForm] = useState({
    usuario: "",
    senha: ""
  });

  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (erro) setErro("");
  }

  function handleLogin(e) {
    e.preventDefault();

    const user = USUARIOS[form.usuario];

    if (!user || user.senha !== form.senha) {
      return setErro("Usuário ou senha inválidos");
    }

    localStorage.setItem("tipo", user.tipo);
    navigate("/postos/ordenado");
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Background />

      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <LoginCard
          form={form}
          erro={erro}
          onChange={handleChange}
          onSubmit={handleLogin}
        />
      </div>
    </div>
  );
}

//COMPONENTES

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

function LoginCard({ form, erro, onChange, onSubmit }) {
  return (
    <div className="w-full max-w-sm bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl">
      <LogoSection />

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          name="usuario"
          type="text"
          placeholder="Usuário"
          value={form.usuario}
          onChange={onChange}
        />

        <Input
          name="senha"
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={onChange}
        />

        <button className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-semibold transition">
          Entrar
        </button>

        {erro && (
          <p className="text-red-500 text-sm text-center">{erro}</p>
        )}
      </form>
    </div>
  );
}

function LogoSection() {
  return (
    <div className="flex flex-col items-center mb-6">
      <img
        src={logo}
        alt="Logo"
        className="w-24 h-24 object-contain mb-2 drop-shadow-lg"
      />
      <p className="text-gray-600 text-sm">Acesso restrito</p>
    </div>
  );
}

function Input({ name, type, placeholder, value, onChange }) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}