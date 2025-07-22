import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EvenementsTable from "./components/EvenementsTable";
import Signup from "./components/Signup";
import Login from './components/Login';
import { DelegationsList } from './components/DelegationsList';
import GalerieMedia from './components/GalerieMedia';
import DashboardEvenementsDelegations from './components/DashboardEvenementsDelegations';
import DashboardStats from './components/DashboardStats';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/event" element={<EvenementsTable />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/delegations" element={<DelegationsList />} />
        <Route path="/galerie" element={<GalerieMedia />} />
        <Route path="/dashclient" element={<DashboardEvenementsDelegations />} />
        <Route path="/stats" element={<DashboardStats />} />
      </Routes>
    </Router>
  );
}

export default App;
