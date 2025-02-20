import React from "react";
import "../styling/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h3>Skill Scheduler</h3>
          <p>Plan, track, and achieve your study goals efficiently with Skill Scheduler.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Go To </h3>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/planner">Planner</a></li>
            <li><a href="/notes">Notes</a></li>
            <li><a href="/quizzes">Quiz</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@skillscheduler.com</p>
          <p>GitHub: <a href="https://github.com/ishitatrivedi-dell" target="_blank" rel="noopener noreferrer">View Github</a></p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Skill Scheduler. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
