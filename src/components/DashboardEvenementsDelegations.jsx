import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/Dashboard.css";
import criImage from "../assets/Images/cri.jpg";

const DashboardEvenementsDelegations = () => {
  const [evenements, setEvenements] = useState([]);
  const [delegations, setDelegations] = useState([]);
  const [mediaMap, setMediaMap] = useState({}); // Clé = evenementId, valeur = URL image

  useEffect(() => {
    axios.get("http://localhost:8080/api/evenements")
      .then((res) => {
        setEvenements(res.data);
        res.data.forEach((ev) => fetchMedia(ev.id)); // charger les médias
      })
      .catch((err) => console.error("Erreur événements :", err));

    axios.get("http://localhost:8080/api/delegations/all")
      .then((res) => setDelegations(res.data))
      .catch((err) => console.error("Erreur délégations :", err));
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const fetchMedia = async (evenementId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/medias/evenement/${evenementId}`);
      if (res.data.length > 0) {
        const media = res.data[0];
        setMediaMap((prev) => ({
          ...prev,
          [evenementId]: `http://localhost:8080/api/medias/fichiers/${media.nomFichier}`,
        }));
      }
    } catch (err) {
      console.error("Erreur chargement média pour événement", evenementId, ":", err);
    }
  };

  return (
 <div className="home-container">
  {/* HEADER */}
  <header
    className="main-header"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #ddd',
    }}
  >
    <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3748' }}>
      Event-nj
    </h1>
    <button
      onClick={() => window.location.href = "/"}
      style={{
        backgroundColor: '#e53e3e',
        color: '#fff',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      Se déconnecter
    </button>
  </header>

  {/* HERO SECTION */}
  <section
  className="hero-section"
  style={{
    backgroundImage: `url(${criImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '100px 20px',
    color: '#fff',
    textAlign: 'center',
  }}
>

    <h1 className="hero-title">Centre Régional d’Investissement</h1>
    <p className="hero-subtitle">
      Un partenaire stratégique pour le développement territorial
    </p>
    <div className="hero-buttons">
  <button
    className="hero-btn"
    onClick={() => {
      document.getElementById("evenements")?.scrollIntoView({ behavior: "smooth" });
    }}
  >
    Consulter événements
  </button>
  <button
    className="hero-btn secondary"
    onClick={() => {
      document.getElementById("delegations")?.scrollIntoView({ behavior: "smooth" });
    }}
  >
    Consulter délégations
  </button>
</div>

  </section>

  {/* NOTRE MISSION */}
  <section className="mission-section">
    <h2>Notre Mission</h2>
    <p>
      En tant que Centre Régional d’Investissement, notre mission est de faciliter, promouvoir et
      accompagner les projets d’investissement dans la région. Nous agissons comme un catalyseur
      du développement économique, en assurant un accueil personnalisé aux investisseurs, en
      simplifiant les procédures administratives et en accompagnant les porteurs de projets.
    </p>
  </section>

  {/* NOS OBJECTIFS */}
  <section className="objectives-section">
    <h2>Nos Objectifs</h2>
    <ul>
      <li>Renforcer l’attractivité territoriale de la région</li>
      <li>Accélérer le traitement des dossiers d’investissement</li>
      <li>Favoriser la création d’emplois et la croissance économique</li>
      <li>Améliorer la qualité des services offerts aux investisseurs</li>
      <li>Développer une intelligence territoriale à travers la collecte et l’analyse de données</li>
    </ul>
  </section>

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>

  {/* ÉVÉNEMENTS */}
  <section id="evenements" className="event-grid-section">
  <h2>Événements</h2>

  <div style={{ position: 'relative', width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
  <i
    className="fas fa-search"
    style={{
      position: 'absolute',
      left: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#b4009c',
    }}
  />
  <input
    type="text"
    placeholder="Rechercher un événement..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      padding: '8px 12px 8px 32px', // Padding gauche augmenté pour l'icône
      width: '100%',
      borderRadius: '6px',
      border: '1px solid #b4009c',
    }}
  />
</div>

  <div className="event-grid">
    {evenements
      .filter((ev) =>
        ev.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.lieu.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((ev) => (
        <div key={ev.id} className="event-card">
          {mediaMap[ev.id] && (
            <img src={mediaMap[ev.id]} alt={ev.titre} className="event-img" />
          )}
          <h3>{ev.titre}</h3>
          <p>{ev.description}</p>
          <p><strong>Date :</strong> {new Date(ev.date).toLocaleDateString()}</p>
          <p><strong>Lieu :</strong> {ev.lieu}</p>
          <p><strong>Délégations :</strong> {ev.delegations?.length || 0}</p>
        </div>
      ))}
  </div>
</section>


  {/* DÉLÉGATIONS */}
  <section id="delegations" className="delegation-list-section">
    <h2>Délégations</h2>
    <table className="delegation-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Représentant</th>
          <th>Contact</th>
          <th>Événement</th>
        </tr>
      </thead>
      <tbody>
        {delegations.map((del) => (
          <tr key={del.id}>
            <td>{del.nom}</td>
            <td>{del.representant || "-"}</td>
            <td>{del.contact || "-"}</td>
            <td>{del.evenement?.titre || "Non lié"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
</div>

  );
};

export default DashboardEvenementsDelegations;
