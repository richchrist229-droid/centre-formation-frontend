import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentForm from "./pages/StudentForm";
import Formations from "./pages/Formations";
import Inscriptions from "./pages/Inscriptions";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/etudiants" element={<Students />} />
          <Route path="/etudiants/nouveau" element={<StudentForm />} />
          <Route path="/etudiants/:id/modifier" element={<StudentForm />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/inscriptions" element={<Inscriptions />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}