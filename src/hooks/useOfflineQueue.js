import { useEffect, useState } from "react";
import { submitSession } from "../api/sessions.api";

const QUEUE_KEY = "session_queue";

function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function useOfflineQueue() {
  const [pendingCount, setPendingCount] = useState(() => getQueue().length);

  function enqueue(payload) {
    const queue = getQueue();
    queue.push(payload);
    saveQueue(queue);
    setPendingCount(queue.length);
    console.log("[Offline queue] Sesión guardada localmente. Pendientes:", queue.length);
  }

  async function flush() {
    const queue = getQueue();
    if (queue.length === 0) return;

    console.log("[Offline queue] Reconectado. Enviando", queue.length, "sesión(es) pendiente(s)...");

    const failed = [];
    for (const payload of queue) {
      try {
        await submitSession(payload);
      } catch {
        failed.push(payload);
      }
    }

    saveQueue(failed);
    setPendingCount(failed.length);
  }

  useEffect(() => {
    window.addEventListener("online", flush);
    return () => window.removeEventListener("online", flush);
  }, []);

  return { enqueue, pendingCount };
}
