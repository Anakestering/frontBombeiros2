export function ListaFotos({ lista, setImagemAberta }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {lista.map((item, i) => (
        <div key={i} className="text-center">
          <img src={item.foto} onClick={() => setImagemAberta(item.foto)} className="w-20 h-20 rounded-lg shadow cursor-pointer" alt="" />
          <p className="text-xs text-gray-500">{item.dataHora}</p>
        </div>
      ))}
    </div>
  );
}