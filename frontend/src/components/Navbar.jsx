import '../styling/navbar.css'
import React from 'react'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo" >Skill Scheduler</div>
      <a href="http://"></a>
      <ul className="nav-links">
        <li><a href="/">Dashboard</a></li>
        <li><a href="/planner">Planner</a></li>
        <li><a href="/notes">Notes</a></li>
        <li><a href="/quizz">Quizzes</a></li>       
      </ul>
    </nav>
  );
};

export default Navbar;
