import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const empty = { matricule: "", nom: "", prenom: "", email: "", telephone: "", date_naissance: "", sexe: "M", adresse: "" };

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      api.get(`/students/${id}`).then((r) => {
        const { matricule, nom, prenom, email, telephone, date_naissance, sexe, adresse } = r.data;
        setForm({
          matricule, nom, prenom, email,
          telephone: telephone ?? "",
          date_naissance: date_naissance ? date_naissance.substring(0, 10) : "",
          sexe,
          adresse: adresse ?? "",
        });
      });
    }
  }, [id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (id) await api.put(`/students/${id}`, form);
      else await api.post("/students", form);
      navigate("/etudiants");
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors);
    }
  };

  const field = (name, label, type = "text") => (
    <div className="field">
      <label>{label}</label>
      <input type={type} name={name} value={form[name]} onChange={change} />
      {errors[name] && <div className="error">{errors[name][0]}</div>}
    </div>
  );

  return (
    <form className="card" onSubmit={submit} style={{ maxWidth: 500 }}>
      <h2>{id ? "Modifier" : "Ajouter"} un étudiant</h2>
      {field("matricule", "Matricule")}
      {field("nom", "Nom")}
      {field("prenom", "Prénom")}
      {field("email", "Email", "email")}
      {field("telephone", "Téléphone")}
      {field("date_naissance", "Date de naissance", "date")}
      <div className="field">
        <label>Sexe</label>
        <select name="sexe" value={form.sexe} onChange={change}>
          <option value="M">Masculin</option>
          <option value="F">Féminin</option>
        </select>
      </div>
      {field("adresse", "Adresse")}
      <button className="btn" type="submit">Enregistrer</button>{" "}
      <button className="btn btn-gray" type="button" onClick={() => navigate("/etudiants")}>Annuler</button>
    </form>
  );
}