# Companion App

App móvil para operadores de campo que recolectan datos espaciales con kits de hardware. Reemplaza libretas de papel registrando sesiones con: equipo usado, duración e incidentes.

## Stack

- React 19 + Vite 8
- Tailwind CSS v4
- react-router-dom v7

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:5173 en el navegador. Para simular un dispositivo móvil usa DevTools (F12 → ícono de dispositivo móvil).

## Notas

- No hay servidor real — el API es un mock en memoria (`src/api/mock.js`)
- Las sesiones activas sobreviven a refresh via `localStorage` (`active_sessions`)
