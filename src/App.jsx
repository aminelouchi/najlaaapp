import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EvenementsTable from "./components/EvenementsTable";
import Signup from "./components/Signup";
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EvenementsTable />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
