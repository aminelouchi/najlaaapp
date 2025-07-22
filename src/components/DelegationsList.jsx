import { useEffect, useState } from "react";
import axios from "axios";
import av from "../assets/Images/avatar.jpg";
import Swal from 'sweetalert2';

import {
  Users, Plus, Search, Filter, MapPin, Calendar, Phone, Mail,
  Building, Edit, Trash2, Eye
} from "lucide-react";

import "../assets/delegation.css";

export function DelegationsList() {
  const [delegations, setDelegations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");

  useEffect(() => {
    axios.get("http://localhost:8080/api/delegations/all")
      .then((response) => {
        setDelegations(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des délégations :", error);
      });
  }, []);

const [evenements, setEvenements] = useState([]); // bon

useEffect(() => {
  axios.get("http://localhost:8080/api/evenements")
    .then((res) => {
      if (Array.isArray(res.data)) {
        setEvenements(res.data);
      } else {
        console.error("Les événements retournés ne sont pas un tableau :", res.data);
      }
    })
    .catch((err) => console.error("Erreur chargement événements :", err));
}, []);



  const filteredDelegations = delegations.filter((delegation) => {
    const matchesSearch =
      delegation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delegation.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delegation.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delegation.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "Tous" || delegation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Terminée": return "bg-green-100 text-green-700 border-green-200";
      case "En cours": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Confirmée": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCountryFlag = (country) => {
    const flags = {
      France: "🇫🇷", Allemagne: "🇩🇪", Italie: "🇮🇹", Espagne: "🇪🇸", Portugal: "🇵🇹"
    };
    return flags[country] || "🌍";
  };



const [form, setForm] = useState({
  nom: "",
  contact: "",
  representant: "",
  evenementId: "", // 👈 nouvel identifiant
});



const handleChange = (e) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
};


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`http://localhost:8080/api/delegations/add/${form.evenementId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom: form.nom,
        contact: form.contact,
        representant: form.representant,
      }),
    });

    if (res.ok) {
  setShowModal(false);
  Swal.fire({
    icon: 'success',
    title: 'Succès',
    text: 'Délégation ajoutée avec succès !',
    confirmButtonColor: '#7f00a6ff'
  });
} else {
  Swal.fire({
    icon: 'error',
    title: 'Erreur',
    text: 'Erreur lors de l\'ajout !',
    confirmButtonColor: '#d33'
  });
}

  } catch (error) {
  console.error("Erreur réseau :", error);
  Swal.fire({
    icon: 'error',
    title: 'Erreur réseau',
    text: 'Impossible d\'ajouter la délégation. Veuillez réessayer.',
    confirmButtonColor: '#d33'
  });
}

};



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
          <a href="/delegations" className="menu-link active">
            <i className="fas fa-door-open"></i>
            <span>Délégations</span>
          </a>
        </li>
        <li className="menu-item">
          <a href="/galerie" className="menu-link">
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

  {/* Main Content */}
  <main className="main-content ml-[250px] p-6"> {/* Assure-toi que ton CSS réserve 250px pour le sidebar */}
    <div className="container">
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
              
      {/* En-tête */}
      <div className="flex-header">
        <div>
          <h1>Gestion des Délégations</h1>
          <p className="subtitle">Gérez les délégations invitées et reçues pour vos événements</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-4">
        <div className="card"><Users /><p>{delegations.length} délégations</p></div>
      </div>

      <div className="flex-header">
      <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Nouvelle Délégation
        </button>
</div>
      {/* Tableau */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Représentant</th>
            <th>Contact</th>
            <th>Événement</th>
          </tr>
        </thead>
        <tbody>
          {delegations.map((delegation) => (
            <tr key={delegation.id}>
              <td>#{delegation.id}</td>
              <td>{delegation.nom}</td>
              <td>{delegation.representant || "—"}</td>
              <td>{delegation.contact || "—"}</td>
              <td>{delegation.evenement?.titre || "Non lié"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Ajouter une Délégation</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="delegation-group">
          <label htmlFor="nom">Nom de la délégation</label>
          <input
            id="nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="Nom de la délégation"
            required
          />
        </div>

        <div className="delegation-group">
          <label htmlFor="contact">Contact</label>
          <input
            id="contact"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact"
          />
        </div>

        <div className="delegation-group">
          <label htmlFor="representant">Représentant</label>
          <input
            id="representant"
            name="representant"
            value={form.representant}
            onChange={handleChange}
            placeholder="Représentant"
          />
        </div>

        <div className="delegation-group">
          <label htmlFor="evenementId">Événement associé</label>
          <select
            id="evenementId"
            name="evenementId"
            value={form.evenementId}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionnez un événement --</option>
            {evenements.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.titre}</option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={() => setShowModal(false)}>Annuler</button>
          <button type="submit">Ajouter</button>
        </div>
      </form>
    </div>
  </div>
)}




    </div>
  </main>
</>
); // 👈 le `return` contient tout dans une seule balise
}
