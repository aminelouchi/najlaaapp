import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../assets/style.css";
import av from "../assets/Images/avatar.jpg";

const EvenementsTable = () => {
  const [evenements, setEvenements] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEdit = (event) => {
  setSelectedEvent(event);
  setShowModal(true);
};

const [suggestions, setSuggestions] = useState([]);

const [keyword, setKeyword] = useState("");
const [showDatePicker, setShowDatePicker] = useState(false);
const [searchDate, setSearchDate] = useState("");

const filterByDate = () => {
  if (!searchDate) return;

  axios
    .get("http://localhost:8080/api/evenements/search", {
      params: {
        date: searchDate,
      },
    })
    .then((res) => setEvenements(res.data))
    .catch((err) => {
      console.error("Erreur de filtrage par date :", err);
      Swal.fire("Erreur", "Impossible de filtrer les événements.", "error");
    });
};


const searchEvents = () => {
  axios
    .get("http://localhost:8080/api/evenements/search", {
      params: {
        keyword: keyword.trim() || null,
        date: searchDate || null,
      },
    })
    .then((res) => setEvenements(res.data))
    .catch((err) => {
      console.error("Erreur de recherche :", err);
      Swal.fire("Erreur", "Impossible de rechercher les événements.", "error");
    });
};


const [showAddModal, setShowAddModal] = useState(false);
const [newEvent, setNewEvent] = useState({
  titre: "",
  description: "",
  date: "",
  lieu: "",
});



  // ✅ Fonction à l'extérieur de useEffect
const handleDelete = (id) => {
  Swal.fire({
    title: "Êtes-vous sûr ?",
    text: "Cette action supprimera définitivement l'événement.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`http://localhost:8080/api/evenements/${id}`)
        .then(() => {
          setEvenements((prev) => prev.filter((e) => e.id !== id));

          Swal.fire({
            title: "Supprimé !",
            text: "L'événement a été supprimé avec succès.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        })
        .catch((error) => {
          Swal.fire({
            title: "Erreur",
            text: "Une erreur s'est produite lors de la suppression.",
            icon: "error",
          });
          console.error("Erreur lors de la suppression :", error);
        });
    }
  });
};

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/evenements")
      .then((res) => setEvenements(res.data))
      .catch((err) => console.error("Erreur lors du chargement des événements :", err));

    const toggleSidebar = () => {
      document.querySelector(".sidebar")?.classList.toggle("active");
    };

    const activateMenuItem = (e) => {
      document.querySelectorAll(".menu-link").forEach((l) => l.classList.remove("active"));
      e.currentTarget.classList.add("active");
    };

    const showNotifications = () => alert("Notifications dropdown would appear here");
    const showProfile = () => alert("User profile dropdown would appear here");

    document.getElementById("toggleSidebar")?.addEventListener("click", toggleSidebar);
    document.querySelectorAll(".menu-link").forEach((link) =>
      link.addEventListener("click", activateMenuItem)
    );
    document.querySelector(".header-notification")?.addEventListener("click", showNotifications);
    document.querySelector(".user-profile")?.addEventListener("click", showProfile);

    return () => {
      document.getElementById("toggleSidebar")?.removeEventListener("click", toggleSidebar);
      document.querySelectorAll(".menu-link").forEach((link) =>
        link.removeEventListener("click", activateMenuItem)
      );
      document.querySelector(".header-notification")?.removeEventListener("click", showNotifications);
      document.querySelector(".user-profile")?.removeEventListener("click", showProfile);
    };
  }, []);

  // ... return JSX ici


  return (
    <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></link>
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
              <a href="#" className="menu-link">
                <i className="fas fa-tachometer-alt"></i>
                <span>Tableau de bord</span>
              </a>
            </li>
            <li className="menu-item">
              <a href="#" className="menu-link active">
                <i className="fas fa-users"></i>
                <span>Evenements</span>
              </a>
            </li>
            <li className="menu-item">
              <a href="#" className="menu-link">
                <i className="fas fa-door-open"></i>
                <span>Delegations</span>
              </a>
            </li>
            <li className="menu-item">
              <a href="#" className="menu-link">
                <i className="fas fa-box"></i>
                <span>Galerie Medias</span>
              </a>
            </li>
          </ul>

          <ul className="menu-items">
            <li className="menu-item">
              <a href="#" className="menu-link">
                <i className="fas fa-chart-line"></i>
                <span>Statistiques</span>
              </a>
            </li>
            <li className="menu-item">
              <a href="#" className="menu-link">
                <i className="fas fa-file-alt"></i>
                <span>Rapports</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="toggle-sidebar" id="toggleSidebar">
              <i className="fas fa-bars"></i>
            </button>
            <div className="header-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Rechercher des événements..."
                value={keyword}
                onChange={(e) => {
                  const value = e.target.value;
                  setKeyword(value);

                  if (value.length > 0) {
                    const filtered = evenements
                      .filter((event) =>
                        (event.titre + event.description)
                          .toLowerCase()
                          .includes(value.toLowerCase())
                      )
                      .slice(0, 5); // limiter à 5 suggestions

                    setSuggestions(filtered);
                  } else {
                    setSuggestions([]);
                  }
                }}

                onKeyDown={(e) => {
                  if (e.key === "Enter") searchEvents();
                }}
              />
                {suggestions.length > 0 && (
    <ul
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        background: "white",
        border: "1px solid #ccc",
        borderTop: "none",
        zIndex: 999,
        maxHeight: "200px",
        overflowY: "auto",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {suggestions.map((event) => (
        <li
          key={event.id}
          onClick={() => {
            setKeyword(event.titre);
            setSuggestions([]);
            searchEvents();
          }}
          style={{
            padding: "0.5rem 1rem",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
          }}
          onMouseDown={(e) => e.preventDefault()} // évite la perte de focus
        >
          {event.titre}
        </li>
      ))}
    </ul>
  )}
            </div>
          </div>

          <div className="header-right">
            <div className="header-notification">
              <i className="fas fa-bell"></i>
              <span className="notification-badge">3</span>
            </div>

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

        <div className="content">
          <div className="page-header">
            <h1 className="page-title">Evenements</h1>
            <div className="page-actions">
              <button className="btn" onClick={() => setShowAddModal(true)}>
                <i className="fas fa-plus"></i> Nouvel Evenement
              </button>
            </div>
          </div>

          {/* Table dynamique */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Evenement en cours</h2>
              <div className="card-actions">
                <button className="btn">
                  <i className="fas fa-list"></i> Liste
                </button>
                <button className="btn">
                  <i className="fas fa-th-large"></i> Grid
                </button>
                <button
                  className="btn"
                  onClick={() => setShowDatePicker((prev) => !prev)}
                >
                  <i className="fas fa-filter"></i> Filtrer
                </button>
                {showDatePicker && (
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    onBlur={filterByDate} // ou ajouter un bouton "Appliquer"
                    style={{
                      padding: "0.5rem",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      marginLeft: "1rem",
                    }}
                  />
                )}
                <button className="btn">
                  <i className="fas fa-download"></i> Exporter
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Lieu</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {evenements.map((event) => (
                    <tr key={event.id}>
                      <td>#{event.id}</td>
                      <td>{event.titre}</td>
                      <td>{event.description}</td>
                      <td>{new Date(event.date).toLocaleDateString()}</td>
                      <td>{event.lieu}</td>
                      <td>
                        <span className="status confirmed">Confirmée</span>
                      </td>
                      <td>
                        <button
                          className="action-btn"
                          title="Modifier"
                          onClick={() => handleEdit(event)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        <button
                          className="action-btn"
                          title="Annuler"
                          onClick={() => handleDelete(event.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
{showModal && selectedEvent && (
  <div className="modal-overlay">
    <div className="modal-container">
      <h2>Modifier l'événement</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          axios
            .put(`http://localhost:8080/api/evenements/update/${selectedEvent.id}`, selectedEvent)
            .then(() => {
              setEvenements((prev) =>
                prev.map((ev) => (ev.id === selectedEvent.id ? selectedEvent : ev))
              );
              setShowModal(false);
              Swal.fire({
                title: "Modifié avec succès !",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });
            })
            .catch((err) => {
              console.error("Erreur lors de la modification :", err);
              Swal.fire("Erreur", "Impossible de modifier l'événement.", "error");
            });
        }}
      >
        <label>Titre</label>
        <input
          type="text"
          value={selectedEvent.titre}
          onChange={(e) => setSelectedEvent({ ...selectedEvent, titre: e.target.value })}
        />

        <label>Description</label>
        <textarea
          value={selectedEvent.description}
          onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
        ></textarea>

        <label>Date</label>
        <input
          type="date"
          value={selectedEvent.date}
          onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
        />

        <label>Lieu</label>
        <input
          type="text"
          value={selectedEvent.lieu}
          onChange={(e) => setSelectedEvent({ ...selectedEvent, lieu: e.target.value })}
        />

        <div className="modal-buttons">
          <button type="button" className="cancel" onClick={() => setShowModal(false)}>
            Annuler
          </button>
          <button type="submit" className="save">
            Modifier
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{showAddModal && (
  <div className="modal-overlay">
    <div className="modal-container">
      <h2>Ajouter un événement</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          axios
            .post("http://localhost:8080/api/evenements", newEvent)
            .then((res) => {
              setEvenements((prev) => [...prev, res.data]);
              setShowAddModal(false);
              setNewEvent({ titre: "", description: "", date: "", lieu: "" });
              Swal.fire({
                title: "Ajouté avec succès !",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });
            })
            .catch((err) => {
              console.error("Erreur lors de l'ajout :", err);
              Swal.fire("Erreur", "Impossible d'ajouter l'événement.", "error");
            });
        }}
      >
        <label>Titre</label>
        <input
          type="text"
          value={newEvent.titre}
          onChange={(e) => setNewEvent({ ...newEvent, titre: e.target.value })}
        />

        <label>Description</label>
        <textarea
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        ></textarea>

        <label>Date</label>
        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />

        <label>Lieu</label>
        <input
          type="text"
          value={newEvent.lieu}
          onChange={(e) => setNewEvent({ ...newEvent, lieu: e.target.value })}
        />

        <div className="modal-buttons">
          <button type="button" className="cancel" onClick={() => setShowAddModal(false)}>
            Annuler
          </button>
          <button type="submit" className="save">
            Ajouter
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      </main>


    </>
  );
};

export default EvenementsTable;
