import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../assets/Login.css";
import logo from "../assets/Images/Logo.jpg"; // ton image

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    motDePasse: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8081/api/personne/login", formData);
      if (res.status === 200) {
        Swal.fire("Succès", res.data, "success");
        // Redirection ici si nécessaire, ex :
        window.location.href = "/";
      }
    } catch (error) {
      Swal.fire("Erreur", error.response?.data || "Erreur de connexion", "error");
    }
  };

  return (
    <div className="general">
    <div className="signup-wrapper">
      {/* Illustration */}
      <div className="illustration-section">
        <img src={logo} alt="Connexion" className="illustration-img" />
        <div className="illustration-text">
          <h2>Content de vous revoir</h2>
          <p>Connectez-vous pour accéder à votre espace personnel.</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="login-section">
        <div className="login-card">
          <div className="login-header">
            <h2><i className="bi bi-box-arrow-in-right"></i> Connexion</h2>
            <p>Entrez vos identifiants</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Entrez votre adresse email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="motDePasse">Mot de passe</label>
              <input
                type="password"
                id="motDePasse"
                name="motDePasse"
                required
                placeholder="Entrez votre mot de passe"
                value={formData.motDePasse}
                onChange={handleChange}
              />
            </div>

            <div className="options">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label" htmlFor="remember">Se souvenir de moi</label>
              </div>
              <a href="#">Mot de passe oublié ?</a>
            </div>

            <button type="submit" className="btn">
              <i className="bi bi-box-arrow-in-right"></i> Se connecter
            </button>

            <div className="signup-text">
              Pas encore de compte ? <a href="/signup">S'inscrire ici</a>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}
