import React, { useEffect, useState } from "react";
import "../styling/dashboard.css"; // Make sure to create and style this CSS file

const Dashboard = () => {
  const [progress, setProgress] = useState(0);
  const [studyHours, setStudyHours] = useState(0);
  const [quizProgress, setQuizProgress] = useState(0);
  const [notes, setNotes] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);

  // Fetch Progress Overview
  useEffect(() => {
    fetch("https://skill-scheduler.onrender.com/api/dashboard/progress")
      .then((response) => response.json())
      .then((data) => {
        setProgress(data.completion || 0);
        setStudyHours(data.studiedHours || 0);
        console.log(data);
        setQuizProgress(data.quizProgress || 0);
      })
      .catch((error) => console.error("Error fetching progress:", error));
  }, []);

  // Fetch Notes Overview
  useEffect(() => {
    fetch("https://skill-scheduler.onrender.com/api/dashboard/dashboard")
      .then((response) => response.json())
      .then((data) => setNotes(data.notesOverview || []))
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

  // Fetch Upcoming Exams
  useEffect(() => {
    fetch("https://skill-scheduler.onrender.com/api/dashboard/upcoming-exams")
      .then((response) => response.json())
      .then((data) => setUpcomingExams(data || []))
      .catch((error) => console.error("Error fetching exams:", error));
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome to Skill Scheduler</h1>
      <p className="focus-text">Focus Forward</p>
      <div className="dashboard-content">
        {/* Progress Overview Section */}
        <div className="progress-box">
          <h3>Progress Overview</h3>
          <div className="progress-circle">
            <div className="progress-text">{studyHours}Hr</div>
          </div>
          <p>Your Progress</p>
          <div className="quiz-progress">
            <p>Quiz progress</p>
            <div className="quiz-bar">
              <div className="quiz-fill" style={{ width: `${quizProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Notes Overview Section */}
        <div className="notes-section">
          <h3>Points from Notes</h3>
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <p key={index} className="note-content">{note.content}</p>
            ))
          ) : (
            <p>No notes available.</p>
          )}
        </div>

        {/* Exam Priority Section */}
        <div className="exam-priority">
          <h3>Exam Priority</h3>
          <ul>
            {upcomingExams.map((exam, index) => (
              <li key={index}>{exam.subject} - {exam.date}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

