import { createContext, useContext, useRef, useState, useCallback } from "react";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState({});
  const intervals = useRef({});

  const startSession = useCallback((deviceId) => {
    if (intervals.current[deviceId]) return;
    const startedAt = new Date().toISOString();
    setSessions((prev) => ({
      ...prev,
      [deviceId]: { seconds: 0, isRunning: true, startedAt },
    }));
    intervals.current[deviceId] = setInterval(() => {
      setSessions((prev) => ({
        ...prev,
        [deviceId]: { ...prev[deviceId], seconds: (prev[deviceId]?.seconds ?? 0) + 1 },
      }));
    }, 1000);
  }, []);

  const stopSession = useCallback((deviceId) => {
    clearInterval(intervals.current[deviceId]);
    delete intervals.current[deviceId];
    setSessions((prev) => ({
      ...prev,
      [deviceId]: { ...prev[deviceId], isRunning: false },
    }));
  }, []);

  const clearSession = useCallback((deviceId) => {
    clearInterval(intervals.current[deviceId]);
    delete intervals.current[deviceId];
    setSessions((prev) => {
      const next = { ...prev };
      delete next[deviceId];
      return next;
    });
  }, []);

  return (
    <SessionContext.Provider value={{ sessions, startSession, stopSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(deviceId) {
  const ctx = useContext(SessionContext);
  const session = deviceId
    ? ctx.sessions[deviceId] ?? { seconds: 0, isRunning: false, startedAt: null }
    : null;

  return {
    ...(session ?? {}),
    allSessions: ctx.sessions,
    startSession: () => ctx.startSession(deviceId),
    stopSession: () => ctx.stopSession(deviceId),
    clearSession: () => ctx.clearSession(deviceId),
  };
}
