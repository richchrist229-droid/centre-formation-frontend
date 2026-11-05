import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [formations, setFormations] = useState([]);
  const [meta, setMeta] = useState({});
  const [filters, setFilters] = useState({ search: "", sexe: "", formation_id: "", page: 1 });

  const load = () =>
    api.get("/students", { params: filters }).then((r) => {
      setStudents(r.data.data);
      setMeta(r.data);
    });

  useEffect(() => { load(); }, [filters]);
  useEffect(() => {
    api.get("/formations", { params: { all: true } }).then((r) => setFormations(r.data));
  }, []);

  const change = (e) => setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet étudiant ?")) return;
    await api.delete(`/students/${id}`);
    load();
  };

  return (
    <>
      <h2>Étudiants</h2>
      <Link className="btn" to="/etudiants/nouveau">+ Ajouter un étudiant</Link>

      <div className="filters">
        <input name="search" placeholder="Nom, prénom, email, matricule..." value={filters.search} onChange={change} />
        <select name="sexe" value={filters.sexe} onChange={change}>
          <option value="">Tous les sexes</option>
          <option value="M">Masculin</option>
          <option value="F">Féminin</option>
        </select>
        <select name="formation_id" value={filters.formation_id} onChange={change}>
          <option value="">Toutes les formations</option>
          {formations.map((f) => <option key={f.id} value={f.id}>{f.intitule}</option>)}
        </select>
      </div>

      <table>
        <thead>
          <tr><th>Matricule</th><th>Nom</th><th>Prénom</th><th>Email</th><th>Sexe</th><th>Formations</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {students.length === 0 && <tr><td colSpan="7">Aucun étudiant trouvé.</td></tr>}
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.matricule}</td>
              <td>{s.nom}</td>
              <td>{s.prenom}</td>
              <td>{s.email}</td>
              <td>{s.sexe}</td>
              <td>{s.inscriptions_count}</td>
              <td>
                <Link className="btn btn-gray" to={`/etudiants/${s.id}/modifier`}>Modifier</Link>{" "}
                <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button className="btn" disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Précédent</button>
        <span>Page {meta.current_page} / {meta.last_page}</span>
        <button className="btn" disabled={filters.page >= meta.last_page} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Suivant</button>
      </div>
    </>
  );
}