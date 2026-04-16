export function PreviewFoto({ foto, onClick, onRemover, onSalvar, salvarLabel }) {
  if (!foto) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <img src={foto} onClick={onClick} className="w-40 h-40 rounded-lg cursor-pointer shadow" alt="" />
      <div className="flex gap-2">
        <button onClick={onRemover} className="bg-red-500 px-3 py-1 text-white rounded">Apagar</button>
        <button onClick={onSalvar} className="bg-blue-600 px-3 py-1 text-white rounded">{salvarLabel}</button>
      </div>
    </div>
  );
}