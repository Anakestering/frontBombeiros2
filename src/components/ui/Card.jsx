export function Card({ titulo, children }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm space-y-2">
      <p className="font-semibold">{titulo}</p>
      {children}
    </div>
  );
}