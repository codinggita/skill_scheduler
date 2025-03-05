import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx"
import Notes from "./components/Notes.jsx";
import Planner from "./components/Planner.jsx";
import Quizz from "./components/Quizz.jsx";
import SubmitQuiz from "./components/SubmitQuiz.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
  return (
    <Router>
      <Navbar/>
      
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/quiz" element={<Quizz/>} />
        <Route path="/submitquiz" element= {<SubmitQuiz/>}></Route>
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
