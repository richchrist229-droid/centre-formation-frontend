import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats").then((r) => setStats(r.data));
  }, []);

  if (!stats) return <p>Chargement...</p>;

  const cards = [
    ["Étudiants", stats.total_etudiants],
    ["Formations", stats.total_formations],
    ["Inscriptions", stats.total_inscriptions],
    ["Revenus potentiels", Number(stats.revenus_potentiels).toLocaleString() + " FCFA"],
  ];

  return (
    <>
      <h2>Tableau de bord</h2>
      <div className="cards">
        {cards.map(([titre, valeur]) => (
          <div className="card" key={titre}>
            <small>{titre}</small>
            <h3>{valeur}</h3>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Inscriptions par formation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.par_formation}>
            <XAxis dataKey="intitule" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="inscriptions_count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>Répartition par statut</h3>
        {stats.par_statut.length === 0 ? (
          <p>Aucune inscription pour le moment.</p>
        ) : (
          <ul>
            {stats.par_statut.map((s) => (
              <li key={s.statut}>{s.statut} : {s.total}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}