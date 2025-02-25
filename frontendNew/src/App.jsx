import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx"
import Notes from "./components/Notes.jsx";
import Planner from "./components/Planner.jsx";


const App = () => {
  return (
    <Router>
      <Navbar/>
      
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/planner" element={<Planner />} />
      </Routes>
    </Router>
  );
};

export default App;
