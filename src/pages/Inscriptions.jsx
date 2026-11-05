import { useEffect, useState } from "react";
import api from "../api";

const today = new Date().toISOString().substring(0, 10);

export default function Inscriptions() {
  const [inscriptions, setInscriptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [formations, setFormations] = useState([]);
  const [filters, setFilters] = useState({ formation_id: "", statut: "" });
  const [form, setForm] = useState({ student_id: "", formation_id: "", date_inscription: today, statut: "en_cours" });
  const [message, setMessage] = useState(null);

  const load = () =>
    api.get("/inscriptions", { params: filters }).then((r) => setInscriptions(r.data.data));

  useEffect(() => { load(); }, [filters]);
  useEffect(() => {
    api.get("/students", { params: { per_page: 200 } }).then((r) => setStudents(r.data.data));
    api.get("/formations", { params: { all: true } }).then((r) => setFormations(r.data));
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.post("/inscriptions", form);
      setMessage({ type: "ok", text: "Inscription enregistrée." });
      load();
    } catch (err) {
      const text = err.response?.data?.message || "Erreur lors de l'inscription.";
      setMessage({ type: "ko", text });
    }
  };

  const changeStatut = async (id, statut) => {
    await api.put(`/inscriptions/${id}`, { statut });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer cette inscription ?")) return;
    await api.delete(`/inscriptions/${id}`);
    load();
  };

  return (
    <>
      <h2>Inscriptions</h2>

      <form className="card" onSubmit={submit} style={{ maxWidth: 500 }}>
        <h3>Nouvelle inscription</h3>
        <div className="field">
          <label>Étudiant</label>
          <select name="student_id" value={form.student_id} onChange={change} required>
            <option value="">-- Choisir --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.matricule} - {s.nom} {s.prenom}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Formation</label>
          <select name="formation_id" value={form.formation_id} onChange={change} required>
            <option value="">-- Choisir --</option>
            {formations.map((f) => <option key={f.id} value={f.id}>{f.intitule}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Date d'inscription</label>
          <input type="date" name="date_inscription" value={form.date_inscription} onChange={change} />
        </div>
        <button className="btn" type="submit">Inscrire</button>
        {message && <p className={message.type === "ok" ? "" : "error"}>{message.text}</p>}
      </form>

      <div className="filters">
        <select value={filters.formation_id} onChange={(e) => setFilters({ ...filters, formation_id: e.target.value })}>
          <option value="">Toutes les formations</option>
          {formations.map((f) => <option key={f.id} value={f.id}>{f.intitule}</option>)}
        </select>
        <select value={filters.statut} onChange={(e) => setFilters({ ...filters, statut: e.target.value })}>
          <option value="">Tous les statuts</option>
          <option value="en_cours">En cours</option>
          <option value="terminee">Terminée</option>
          <option value="abandonnee">Abandonnée</option>
        </select>
      </div>

      <table>
        <thead>
          <tr><th>Étudiant</th><th>Formation</th><th>Date</th><th>Statut</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {inscriptions.length === 0 && <tr><td colSpan="5">Aucune inscription.</td></tr>}
          {inscriptions.map((i) => (
            <tr key={i.id}>
              <td>{i.student?.nom} {i.student?.prenom}</td>
              <td>{i.formation?.intitule}</td>
              <td>{i.date_inscription}</td>
              <td>
                <select value={i.statut} onChange={(e) => changeStatut(i.id, e.target.value)}>
                  <option value="en_cours">En cours</option>
                  <option value="terminee">Terminée</option>
                  <option value="abandonnee">Abandonnée</option>
                </select>
              </td>
              <td><button className="btn btn-danger" onClick={() => remove(i.id)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}