export function Timer({ seconds }) {
  const pad = (n) => String(n).padStart(2, "0");
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return (
    <span className="font-mono font-bold text-7xl text-black tracking-tight">
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}
