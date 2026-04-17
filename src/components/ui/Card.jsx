export function Card({ titulo, children, vazio = false, mensagemVazio = "Nenhum dado" }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm space-y-2">

      <p className="font-semibold">{titulo}</p>

      {vazio ? (
        <p className="text-sm text-gray-500 text-center py-2">
          {mensagemVazio}
        </p>
      ) : (
        children
      )}

    </div>
  );
}