import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ConnectivityBanner } from "../components/ui/ConnectivityBanner";
import { Timer } from "../components/ui/Timer";
import { StateSheet } from "../components/StateSheet";
import { useSession } from "../context/SessionContext";
import { useConnectivity } from "../hooks/useConnectivity";
import { submitSession } from "../api/sessions.api";

const DEVICES = {
  "kit-01": { name: "Kit-01", description: "Escáner LiDAR · v2" },
  "kit-02": { name: "Kit-02", description: "Cámara RGB · v3" },
  "kit-03": { name: "Kit-03", description: "GPS-RTK · v1" },
};

export function SessionPage() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const device = DEVICES[deviceId];

  const { seconds, isRunning, startedAt, startSession, stopSession, clearSession } = useSession(deviceId);
  const [showSheet, setShowSheet] = useState(false);

  const { isOnline } = useConnectivity();

  function handleToggle() {
    if (!isRunning) {
      startSession();
    } else {
      stopSession();
      setShowSheet(true);
    }
  }

  async function handleSave(incidentType) {
    await submitSession({
      deviceId,
      startedAt,
      endedAt: new Date().toISOString(),
      durationSeconds: seconds,
      status: incidentType,
    });
    clearSession();
    setShowSheet(false);
    navigate("/");
  }

  function handleDiscard() {
    clearSession();
    setShowSheet(false);
    navigate("/");
  }

  if (!device) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex flex-col h-dvh px-8 pb-4 pt-10 relative">
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => navigate("/")} className="text-2xl leading-none text-ink self-start">
          ←
        </button>
        <div>
          <h1 className="text-3xl font-bold text-ink leading-tight">Sesión: {device.name}</h1>
          <p className="text-base text-ink-subtle">{device.description}</p>
        </div>
      </div>

      <ConnectivityBanner isOnline={isOnline} />

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
          )}
          <span className={`text-xl font-semibold ${isRunning ? "text-danger" : "text-ink-subtle"}`}>
            {isRunning ? "SESIÓN ACTIVA" : "LISTO PARA INICIAR"}
          </span>
        </div>
        <Timer seconds={seconds} />
      </div>

      <button
        onClick={handleToggle}
        className={`w-full rounded-2xl text-lg font-bold py-4 transition-colors ${
          isRunning
            ? "bg-danger text-white active:bg-danger-dark"
            : "bg-ink text-white active:bg-ink/80"
        }`}
      >
        {isRunning ? "Terminar sesión" : "Iniciar sesión"}
      </button>

      {showSheet && (
        <StateSheet
          deviceName={device.name}
          duration={seconds}
          isOnline={isOnline}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      )}
    </div>
  );
}
