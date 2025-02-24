import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx"
import Sidebar from "./components/Sidebar.jsx";
import Planner from "./components/Planner.jsx";


const App = () => {
  return (
    <Router>
      <Navbar/>
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/planner" element={<Planner />} />
      </Routes>
    </Router>
  );
};

export default App;
