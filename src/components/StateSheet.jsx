import { useState } from "react";

const INCIDENTS = [
  { id: "ok",             label: "Todo OK",         colorClass: "bg-online-surface" },
  { id: "camera_failure", label: "Fallo de cámara", colorClass: "bg-[#f0e6e0]" },
  { id: "low_battery",    label: "Batería baja",     colorClass: "bg-offline-surface" },
];

export function StateSheet({ deviceName, duration, isOnline, onSave, onDiscard }) {
  const [selected, setSelected] = useState(new Set(["ok"]));
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const fmt = (s) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  };

  function handleSelect(id) {
    if (id === "ok") {
      setSelected(new Set(["ok"]));
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete("ok");
      if (next.has(id)) {
        next.delete(id);
        if (next.size === 0) next.add("ok"); 
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSave() {
    onSave([...selected]);
  }

  if (confirmDiscard) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-end z-20">
        <div className="bg-surface-card rounded-t-3xl w-full p-6">
          <p className="text-xl font-bold text-ink mb-1">¿Descartar sesión?</p>
          <p className="text-base text-ink-subtle mb-6">
            Perderás la sesión grabada. Esta acción no se puede deshacer.
          </p>
          <button
            onClick={onDiscard}
            className="w-full rounded-2xl bg-danger text-white font-bold text-lg py-4 mb-3"
          >
            Sí, descartar
          </button>
          <button
            onClick={() => setConfirmDiscard(false)}
            className="w-full rounded-2xl border-[1.5px] border-ink text-ink font-bold text-lg py-4"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-20">
      <div className="bg-surface-card rounded-t-3xl w-full p-6">
        <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-5" />

        <p className="text-xl font-bold text-ink">¿Hubo algún problema?</p>
        <p className="text-base text-ink-subtle mt-1 mb-5">
          Duración {fmt(duration)} · {deviceName}
        </p>

        {INCIDENTS.map((inc) => (
          <button
            key={inc.id}
            onClick={() => handleSelect(inc.id)}
            className={`w-full flex items-center gap-3 border-[1.5px] rounded-2xl px-4 py-4 mb-3 text-left transition-colors ${
              selected.has(inc.id)
                ? "border-brand bg-brand-surface"
                : "border-border-card bg-surface-card"
            }`}
          >
            <span className={`w-6 h-6 rounded-lg flex-none ${inc.colorClass}`} />
            <span className="text-lg font-semibold text-ink">{inc.label}</span>
          </button>
        ))}

        <button
          onClick={handleSave}
          className="w-full rounded-2xl bg-ink text-white font-bold text-lg py-4 mt-1"
        >
          {isOnline ? "Enviar sesión" : "Guardar sesión"}
        </button>

        <p className="text-center text-sm mt-3 text-ink-subtle">
          {isOnline
            ? "Se enviará al servidor ahora"
            : "Se guardará offline y se subirá al reconectar"}
        </p>

        <button
          onClick={() => setConfirmDiscard(true)}
          className="w-full text-center text-sm text-danger mt-4 py-1"
        >
          Descartar sesión
        </button>
      </div>
    </div>
  );
}
