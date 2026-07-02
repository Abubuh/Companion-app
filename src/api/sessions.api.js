import { db } from "./mock.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitSession(payload) {
  await delay(600);

  const body = {
    device_id: payload.deviceId,
    started_at: payload.startedAt,
    ended_at: payload.endedAt,
    duration_seconds: payload.durationSeconds,
    status: payload.status,
  };

  db.sessions.push(body);

  console.log("[POST /api/v1/sessions] Payload:", body);
  console.log("[db.sessions] Total guardadas:", db.sessions.length, db.sessions);

  return { success: true };
}
