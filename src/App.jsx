import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DeviceListPage } from "./pages/DeviceListPage";
import { SessionPage } from "./pages/SessionPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <Routes>
          <Route path="/" element={<DeviceListPage />} />
          <Route path="/session/:deviceId" element={<SessionPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
