import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/GalerieMedia.css";
import av from "../assets/Images/avatar.jpg";

const GalerieMedia = () => {
  const [medias, setMedias] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/medias")
      .then((res) => setMedias(res.data))
      .catch((err) =>
        console.error("Erreur chargement média :", err.response?.data || err.message)
      );
  }, []);

  const getIcon = (type) => {
    if (type.startsWith("video")) return "🎥";
    if (type.startsWith("image")) return "🖼️";
    return "📁";
  };

  // Filtrage en fonction du mot clé
  const filteredMedias = medias.filter((media) =>
    media.nomFichier.toLowerCase().includes(search.toLowerCase()) ||
    media.evenement?.titre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
 <>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />

  {/* Sidebar */}
  <aside className="sidebar">
    <div className="sidebar-header">
      <a href="#" className="logo">
        <i className="fas fa-calendar-alt"></i>
        <span>Event-nj</span>
      </a>
    </div>

    <nav className="sidebar-menu">
      <h3 className="menu-title">Menu Principal</h3>
      <ul className="menu-items">
        <li className="menu-item">
          <a href="/stats" className="menu-link">
            <i className="fas fa-tachometer-alt"></i>
            <span>Tableau de bord</span>
          </a>
        </li>
        <li className="menu-item">
          <a href="/event" className="menu-link">
            <i className="fas fa-users"></i>
            <span>Événements</span>
          </a>
        </li>
        <li className="menu-item">
          <a href="/delegations" className="menu-link">
            <i className="fas fa-door-open"></i>
            <span>Délégations</span>
          </a>
        </li>
        <li className="menu-item">
          <a href="/galerie" className="menu-link active">
            <i className="fas fa-box"></i>
            <span>Galerie Médias</span>
          </a>
        </li>
      </ul>

      <ul className="menu-items">
            <li className="menu-item">
              <a href="/" className="menu-link">
                <i className="fas fa-file-alt"></i>
                <span>Se déconnecter</span>
              </a>
            </li>
          </ul>
    </nav>
  </aside>

  {/* Galerie */}
  <div className="gallery-container">
    <header className="header">
                    <div className="header-left">
                      <button className="toggle-sidebar" id="toggleSidebar">
                        <i className="fas fa-bars"></i>
                      </button>
                    </div>
                    <div className="header-right">
                      <div className="user-profile">
                        <img
                          src={av}
                          alt="User"
                          className="user-avatar"
                        />
                        <span className="user-name">Bouziane Najlaa</span>
                        <i className="fas fa-chevron-down"></i>
                      </div>
                    </div>
                  </header>
    <div className="gallery-header">
      <h2>Galerie Médias</h2>
      <p>Gérez vos photos et vidéos d’événements</p>
      <div className="gallery-actions">
        <div className="search-wrapper" style={{ position: 'relative', width: '100%' }}>
          <i
            className="fas fa-search"
            style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              color: '#888',
              pointerEvents: 'none',
            }}
          ></i>
          <input
            className="search-input"
            style={{ paddingLeft: '35px' }}
            placeholder="Rechercher dans la galerie…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </div>

    <div className={`media-grid ${filteredMedias.length === 1 ? "center-single" : ""}`}>
      {filteredMedias.map((media) => (
        <div key={media.id} className="media-card">
          <div className="media-thumb">
            {media.typeFichier.startsWith("image") ? (
              <>
                <img
                  src={`http://localhost:8080/api/medias/fichiers/${media.nomFichier}`}
                  alt={media.nomFichier}
                />
                <a
                  href={`http://localhost:8080/api/medias/fichiers/${media.nomFichier}`}
                  download
                  className="download-btn"
                >
                  Télécharger
                </a>
              </>
            ) : (
              <div className="video-placeholder">{getIcon(media.typeFichier)}</div>
            )}
          </div>
          <div className="media-info">
            <h4>
              {media.nomFichier.length > 22
                ? media.nomFichier.slice(0, 22) + "..."
                : media.nomFichier}
            </h4>
            <p>{media.evenement?.titre || "Événement inconnu"}</p>
            <small>{(media.taille || 2.4).toFixed(1)} MB</small>
          </div>
        </div>
      ))}
    </div>
  </div>
</>

  );
};

export default GalerieMedia;
