import React from "react";
import "../styling/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-section">
          <h3>Skill Scheduler</h3>
          <p>Plan, track, and achieve your study goals efficiently with Skill Scheduler. Your personal learning companion for success.</p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://github.com/ishitatrivedi-dell" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/planner">Planner</a></li>
            <li><a href="/notes">Notes</a></li>
            <li><a href="/quizzes">Quiz</a></li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="footer-section">
          <h3>Stay Updated</h3>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" aria-label="Email for newsletter" />
            <button type="button">Subscribe</button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p><i className="fas fa-envelope"></i> support@skillscheduler.com</p>
          <p><i className="fab fa-github"></i> <a href="https://github.com/ishitatrivedi-dell" target="_blank" rel="noopener noreferrer">View Github</a></p>
        </div>
      </div>

      <div className="footer-bottom">
        <p> 2025 Skill Scheduler. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
