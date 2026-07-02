import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";

const SESSION_STORAGE_KEY = "active_sessions";

function getStoredSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function persistSessions(sessions) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
}

function calcSeconds(startedAt) {
  return Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
}

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState(() => {
    const stored = getStoredSessions();
    const restored = {};
    for (const [id, session] of Object.entries(stored)) {
      restored[id] = {
        ...session,
        seconds: session.isRunning ? calcSeconds(session.startedAt) : session.seconds,
      };
    }
    return restored;
  });

  const intervals = useRef({});

  useEffect(() => {
    setSessions((prev) => {
      for (const [id, session] of Object.entries(prev)) {
        if (session.isRunning && !intervals.current[id]) {
          intervals.current[id] = setInterval(() => {
            setSessions((s) => ({
              ...s,
              [id]: { ...s[id], seconds: (s[id]?.seconds ?? 0) + 1 },
            }));
          }, 1000);
        }
      }
      return prev;
    });

    const currentIntervals = intervals.current;
    return () => {
      for (const id of Object.keys(currentIntervals)) {
        clearInterval(currentIntervals[id]);
        delete currentIntervals[id];
      }
    };
  }, []);

  const startSession = useCallback((deviceId) => {
    if (intervals.current[deviceId]) return;
    const startedAt = new Date().toISOString();
    setSessions((prev) => {
      const updated = {
        ...prev,
        [deviceId]: { seconds: 0, isRunning: true, startedAt },
      };
      persistSessions(updated);
      return updated;
    });
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
    setSessions((prev) => {
      const updated = {
        ...prev,
        [deviceId]: { ...prev[deviceId], isRunning: false, isPendingReview: true },
      };
      persistSessions(updated);
      return updated;
    });
  }, []);

  const clearSession = useCallback((deviceId) => {
    clearInterval(intervals.current[deviceId]);
    delete intervals.current[deviceId];
    setSessions((prev) => {
      const next = { ...prev };
      delete next[deviceId];
      persistSessions(next);
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
