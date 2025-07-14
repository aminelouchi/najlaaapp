import React, { useState } from 'react';
import axios from 'axios';
import "../assets/Signup.css";
import bg from "../assets/Images/Logo.jpg";
import Swal from 'sweetalert2';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password1 !== formData.password2) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Les mots de passe ne correspondent pas.'
    });
    return;
  }

  try {
    const response = await axios.post('http://localhost:8080/api/personne/save', {
      nom: formData.username,
      email: formData.email, // <- si tu as ajouté le champ email
      motDePasse: formData.password1
    });
    // Redirection ici si nécessaire, ex :
        window.location.href = "/login";

    Swal.fire({
      icon: 'success',
      title: 'Inscription réussie',
      text: 'Votre compte a été créé avec succès !'
    });

    setFormData({ username: '', email: '', password1: '', password2: '' });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: "Une erreur est survenue lors de l'inscription."
    });
    console.error('Erreur Axios :', error);
  }
};


  return (
    <div className='global'>
    <div className="signup-wrapper">
      {/* Section Illustration */}
      <div className="illustration-section">
        <img src={bg} alt="Inscription" className="illustration-img" />
        <div className="illustration-text">
          <h2>Rejoignez notre communauté</h2>
          <p>Créez votre compte pour accéder à toutes les fonctionnalités exclusives de notre plateforme.</p>
        </div>
      </div>

      {/* Section Formulaire */}
      <div className="login-section">
        <div className="login-card">
          <div className="login-header">
            <h2><i className="bi bi-person-plus"></i> Création de compte</h2>
            <p>Remplissez le formulaire pour vous inscrire</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Champ Nom d'utilisateur */}
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="Entrez votre nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Champ Email */}
            <div className="form-group">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="exemple@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Mot de passe */}
            <div className="form-group">
              <label htmlFor="password1">Mot de passe</label>
              <input
                type="password"
                id="password1"
                name="password1"
                required
                placeholder="Créez un mot de passe"
                value={formData.password1}
                onChange={handleChange}
              />
            </div>

            {/* Confirmation */}
            <div className="form-group">
              <label htmlFor="password2">Confirmation du mot de passe</label>
              <input
                type="password"
                id="password2"
                name="password2"
                required
                placeholder="Confirmez votre mot de passe"
                value={formData.password2}
                onChange={handleChange}
              />
            </div>

            {message && <p style={{ color: 'red', marginBottom: '1rem' }}>{message}</p>}

            <button type="submit" className="btn">
              <i className="bi bi-person-plus"></i> S'inscrire
            </button>

            <div className="signup-text">
              Déjà inscrit ? <a href="/login">Connectez-vous ici</a>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}
