export function ConnectivityBanner({ isOnline, pendingCount = 0 }) {
  if (isOnline) {
    return (
      <div className="flex items-center gap-2 bg-online-surface border border-online-border rounded-xl px-3 py-2 mb-3">
        <div>
          <p className="text-xl font-semibold text-online-text leading-tight">En línea</p>
          <p className="text-sm text-online-subtle">Todo sincronizado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-offline-surface border border-offline-border rounded-xl px-3 py-2 mb-3">
      <div>
        <p className="text-xl font-semibold text-offline-text leading-tight">Sin conexión</p>
        <p className="text-sm text-offline-subtle">
          {pendingCount > 0
            ? `${pendingCount} sesión${pendingCount > 1 ? "es" : ""} pendiente${pendingCount > 1 ? "s" : ""} de subir`
            : "se guardará localmente"}
        </p>
      </div>
    </div>
  );
}
