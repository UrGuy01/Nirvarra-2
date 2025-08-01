import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AdminPage from "./admin/AdminPage";
import SetupAdmin from "./admin/SetupAdmin";
import AddAdmin from "./admin/AddAdmin";

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/setup" element={<SetupAdmin />} />
        <Route path="/add-admin" element={<AddAdmin />} />
      </Routes>
    </Suspense>
  );
}

export default App;
