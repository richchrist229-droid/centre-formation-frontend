import { useEffect, useState } from "react";
import api from "../api";

const empty = { intitule: "", description: "", duree_mois: "", frais: "", statut: "actif" };

export default function Formations() {
  const [formations, setFormations] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const load = () =>
    api.get("/formations", { params: { search, all: true } }).then((r) => setFormations(r.data));

  useEffect(() => { load(); }, [search]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (editId) await api.put(`/formations/${editId}`, form);
      else await api.post("/formations", form);
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors);
    }
  };

  const edit = (f) => {
    setEditId(f.id);
    setForm({
      intitule: f.intitule,
      description: f.description ?? "",
      duree_mois: f.duree_mois,
      frais: f.frais,
      statut: f.statut,
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Supprimer cette formation ?")) return;
    await api.delete(`/formations/${id}`);
    load();
  };

  const err = (n) => errors[n] && <div className="error">{errors[n][0]}</div>;

  return (
    <>
      <h2>Formations</h2>

      <form className="card" onSubmit={submit}>
        <h3>{editId ? "Modifier la formation" : "Ajouter une formation"}</h3>
        <div className="field">
          <label>Intitulé</label>
          <input name="intitule" value={form.intitule} onChange={change} />
          {err("intitule")}
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={change} />
        </div>
        <div className="field">
          <label>Durée (mois)</label>
          <input type="number" name="duree_mois" value={form.duree_mois} onChange={change} />
          {err("duree_mois")}
        </div>
        <div className="field">
          <label>Frais (FCFA)</label>
          <input type="number" name="frais" value={form.frais} onChange={change} />
          {err("frais")}
        </div>
        <div className="field">
          <label>Statut</label>
          <select name="statut" value={form.statut} onChange={change}>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>
        <button className="btn" type="submit">{editId ? "Mettre à jour" : "Ajouter"}</button>{" "}
        {editId && (
          <button className="btn btn-gray" type="button" onClick={() => { setEditId(null); setForm(empty); }}>
            Annuler
          </button>
        )}
      </form>

      <div className="filters">
        <input placeholder="Rechercher une formation..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <table>
        <thead>
          <tr><th>Intitulé</th><th>Durée</th><th>Frais</th><th>Statut</th><th>Inscrits</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {formations.length === 0 && <tr><td colSpan="6">Aucune formation.</td></tr>}
          {formations.map((f) => (
            <tr key={f.id}>
              <td>{f.intitule}</td>
              <td>{f.duree_mois} mois</td>
              <td>{Number(f.frais).toLocaleString()} FCFA</td>
              <td>{f.statut}</td>
              <td>{f.inscriptions_count}</td>
              <td>
                <button className="btn btn-gray" onClick={() => edit(f)}>Modifier</button>{" "}
                <button className="btn btn-danger" onClick={() => remove(f.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}