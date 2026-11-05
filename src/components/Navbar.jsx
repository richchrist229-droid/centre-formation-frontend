import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Tableau de bord</Link>
      <Link to="/etudiants">Étudiants</Link>
      <Link to="/formations">Formations</Link>
      <Link to="/inscriptions">Inscriptions</Link>
    </nav>
  );
}