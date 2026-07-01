export function DeviceCard({ device, selected, onSelect, hasActiveSession }) {
  return (
    <button
      onClick={() => onSelect(device)}
      className={`w-full flex items-center gap-3 border-[1.5px] rounded-xl px-3 py-3 mb-2 text-left transition-colors ${
        selected
          ? "border-brand bg-brand-surface"
          : "border-border-card bg-surface-card active:bg-surface-hover"
      }`}
    >
      <span
        className={`w-4.25 h-4.25 rounded-full border-2 flex-none transition-colors ${
          selected ? "border-brand" : "border-ink-faint"
        }`}
        style={selected ? { background: "radial-gradient(#2a78d6 38%, #fff 42%)" } : {}}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xl font-semibold text-ink leading-tight">{device.name}</p>
        <p className="text-lg text-ink-subtle">{device.description}</p>
      </div>

      {hasActiveSession && (
        <span className="flex items-center gap-1 text-xs font-semibold text-danger">
          <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
          En curso
        </span>
      )}
    </button>
  );
}
