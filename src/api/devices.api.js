import { db } from "./mock.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDevices() {
  await delay(800);

  const devices = db.devices.map((device) => ({
    id: device.id,
    name: device.name,
    description: device.description,
  }));

  return devices;
}
