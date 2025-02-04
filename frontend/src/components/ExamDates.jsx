import React, { useState, useEffect } from "react";
import "../styling/examdates.css";

const StudyPlanner = () => {
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({ subject: "", date: "", pendingWork: "" });

  // Fetch exam details from API
  useEffect(() => {
    fetch("https://skill-scheduler.onrender.com/api/planner/exams")
      .then((res) => res.json())
      .then((data) => setExams(data))
      .catch((err) => console.error("Error fetching exams:", err));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setNewExam({ ...newExam, [e.target.name]: e.target.value });
  };

  // Add new exam
  const handleAddExam = (e) => {
    e.preventDefault();
    fetch("https://skill-scheduler.onrender.com/api/planner/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExam),
    })
      .then((res) => res.json())
      .then((data) => {
        setExams([...exams, data]);
        setNewExam({ subject: "", date: "", pendingWork: "" });
      })
      .catch((err) => console.error("Error adding exam:", err));
  };

  // Delete an exam
  const handleDeleteExam = (id) => {
    fetch(`https://skill-scheduler.onrender.com/api/planner/exams/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setExams(exams.filter((exam) => exam._id !== id));
      })
      .catch((err) => console.error("Error deleting exam:", err));
  };

  return (
    <div className="study-planner-container">
      <h2 className="planner-title">Exam Schedule</h2>
      
      <form className="exam-form" onSubmit={handleAddExam}>
        <input
          type="text"
          name="subject"
          placeholder="Subject Name"
          value={newExam.subject}
          onChange={handleChange}
          className="exam-input"
          required
        />
        <input
          type="date"
          name="date"
          value={newExam.date}
          onChange={handleChange}
          className="exam-input"
          required
        />
        <input
          type="text"
          name="pendingWork"
          placeholder="Pending Work"
          value={newExam.pendingWork}
          onChange={handleChange}
          className="exam-input"
        />
        <button type="submit" className="add-exam-btn">Add Exam</button>
      </form>

      <table className="exam-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Pending Work</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam._id}>
              <td>{exam.date}</td>
              <td>{exam.subject}</td>
              <td>{exam.pendingWork}</td>
              <td>
                <button 
                  className="delete-exam-btn" 
                  onClick={() => handleDeleteExam(exam._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudyPlanner;

