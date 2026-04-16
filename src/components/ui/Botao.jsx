export function Botao({ children, onClick, cor, disabled }) {
  const cores = {
    azul: "bg-blue-600 hover:bg-blue-700 text-white",
    verde: "bg-green-600 hover:bg-green-700 text-white",
    cinza: "bg-gray-400 text-white"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`p-2 rounded-lg w-full transition ${cores[cor]}`}>
      {children}
    </button>
  );
}