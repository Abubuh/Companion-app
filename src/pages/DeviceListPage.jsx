import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectivityBanner } from "../components/ui/ConnectivityBanner";
import { DeviceCard } from "../components/DeviceCard";
import { useSession } from "../context/SessionContext";
import { useConnectivity } from "../hooks/useConnectivity";
import { fetchDevices } from "../api/devices.api";

export function DeviceListPage() {
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const { allSessions } = useSession();
  const { isOnline } = useConnectivity();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    isLoading && fetchDevices().then((data) => {
      setDevices(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col h-dvh w-full px-10 pb-4 pt-10">
      <h1 className="text-3xl font-bold text-ink mt-1.5 mb-0.5">Equipos disponibles</h1>
      <p className="text-lg text-ink-subtle mb-3">Selecciona un kit para empezar</p>

      <ConnectivityBanner isOnline={isOnline} />
    
      <div className="flex-1 overflow-y-auto">
        {
          isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg text-ink-subtle">Cargando equipos...</p>
            </div>
          ) 
        }
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            selected={selected?.id === device.id}
            onSelect={setSelected}
            hasActiveSession={!!allSessions[device.id]?.isRunning}
          />
        ))}
      </div>

      <button
        disabled={!selected}
        onClick={() => selected && navigate(`/session/${selected.id}`)}
        className={`w-full rounded-2xl text-lg font-bold py-4 mt-3 transition-colors ${
          selected
            ? "bg-ink text-white active:bg-ink/80"
            : "bg-muted text-muted-text cursor-not-allowed"
        }`}
      >
        {selected && allSessions[selected.id]?.isRunning ? "Retomar sesión" : "Seleccionar"}
      </button>
    </div>
  );
}
