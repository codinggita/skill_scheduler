import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx"; 
import Planner from "./pages/Planner.jsx"; 
import Notes from "./pages/Notes.jsx"; 


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/notes" element={<Notes />} />        
      </Routes>
    </Router>
  );
};

export default App;
