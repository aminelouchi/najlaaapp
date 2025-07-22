import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/DashboardStats.css";
import av from "../assets/Images/avatar.jpg";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DashboardStats = () => {
  const [totals, setTotals] = useState({
    evenements: 0,
    delegations: 0,
    medias: 0,
  });
  const [eventStats, setEventStats] = useState({});
  const [delegationStats, setDelegationStats] = useState({});
  
  const [lastEvents, setLastEvents] = useState([]);
const [lastDelegations, setLastDelegations] = useState([]);


  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [eventsRes, delegationsRes, mediasRes] = await Promise.all([
          axios.get("http://localhost:8080/api/evenements"),
          axios.get("http://localhost:8080/api/delegations/all"),
          axios.get("http://localhost:8080/api/medias"),
        ]);

        setTotals({
          evenements: eventsRes.data.length,
          delegations: delegationsRes.data.length,
          medias: mediasRes.data.length,
        });

        setLastEvents(
  [...eventsRes.data]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
);

setLastDelegations(
  [...delegationsRes.data]
    .sort((a, b) => new Date(b.evenement?.date) - new Date(a.evenement?.date))
    .slice(0, 3)
);


        const groupByDate = (items, key = "date") =>
          items.reduce((acc, item) => {
            const date = item[key];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});

        setEventStats(groupByDate(eventsRes.data));
        setDelegationStats(
          groupByDate(delegationsRes.data, "evenement.date") // ou une autre date si dispo
        );
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques :", err);
      }
    };

    fetchAllStats();
  }, []);

  const buildChartData = (stats, label) => {
  const keys = Object.keys(stats);
  const values = Object.values(stats);
  
  return {
    labels: keys,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          
          if (!chartArea) return '#8606aaff'; // Fallback
          
          // Création du dégradé vertical
          const gradient = ctx.createLinearGradient(
            0, chartArea.bottom, 
            0, chartArea.top
          );
          
          // Dégradé violet moderne
          gradient.addColorStop(0, '#8606aaff'); // Violet foncé
          gradient.addColorStop(0.5, '#b145e8ff'); // Violet moyen
          gradient.addColorStop(1, '#e884feff'); // Violet clair
          
          return gradient;
        },
        borderColor: '#5e04aaff',
        borderWidth: 2,
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 2,
          bottomRight: 2
        },
        hoverBackgroundColor: '#a020f0ff',
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 3,
        barThickness: 'flex',
        categoryPercentage: 0.8,
        barPercentage: 0.9,
      }
    ]
  };
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
              <a href="/stats" className="menu-link active">
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

      {/* Main Dashboard */}
      <div className="dashboard-stats">
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
        <h2>Statistiques générales</h2>
        <div className="cards">
          <div className="card">
            <h3>Événements</h3>
            <p>{totals.evenements}</p>
          </div>
          <div className="card">
            <h3>Délégations</h3>
            <p>{totals.delegations}</p>
          </div>
          <div className="card">
            <h3>Médias</h3>
            <p>{totals.medias}</p>
          </div>
        </div>

        <div className="latest-section">
  <div className="latest-events">
    <h4>🕓 Derniers événements</h4>
    <ul>
      {lastEvents.map((ev) => (
        <li key={ev.id}>
          <strong>{ev.titre}</strong> – {ev.date}
        </li>
      ))}
    </ul>
  </div>

  <div className="latest-delegations">
    <h4>📌 Dernières délégations</h4>
    <ul>
      {lastDelegations.map((del) => (
        <li key={del.id}>
          <strong>{del.nomDelegation}</strong> – lié à <em>{del.evenement?.titre || "Événement inconnu"}</em>
        </li>
      ))}
    </ul>
  </div>
</div>


        <div className="charts">
          <div className="chart">
            <h4 style={{
                textAlign: 'center'
              }}>Événements par date</h4>
            <Bar data={buildChartData(eventStats, "Événements")} />
          </div>
          <div className="chart">
            <h4 style={{
                textAlign: 'center'
              }}>Délégations</h4>
            <Bar data={buildChartData(delegationStats, "Délégations")} />
          </div>
        </div>
      </div>
      
    </>
  );
};

export default DashboardStats;
