import React, { useEffect, useState } from "react";
import "../styling/improvement.css"; // Style the section here

const Improvement = ({ userId }) => {
  const [summary, setSummary] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch(`https://skill-scheduler.onrender.com/api/improvement/summary/${userId}`)
      .then((response) => response.json())
      .then((data) => setSummary(data))
      .catch((error) => console.error("Error fetching improvement summary:", error));

    fetch(`https://skill-scheduler.onrender.com/api/improvement/recommendations/${userId}`)
      .then((response) => response.json())
      .then((data) => setRecommendations(data))
      .catch((error) => console.error("Error fetching recommendations:", error));
  }, [userId]);

  return (
    <div className="improvement-section">
      <h2> 📈 Improvement Insights</h2>

      {summary ? (
        <div>
          <h3>Weak Subjects:</h3>
          <ul>
            {summary.weakSubjects.length > 0 ? (
              summary.weakSubjects.map((subject, index) => <li key={index}>{subject}</li>)
            ) : (
              <p>No weak subjects detected.</p>
            )}
          </ul>

          <h3>Low-Scoring Quizzes:</h3>
          <ul>
            {summary.lowScoringQuizzes.length > 0 ? (
              summary.lowScoringQuizzes.map((quiz, index) => (
                <li key={index}>
                  {quiz.subject}: {quiz.score}%
                </li>
              ))
            ) : (
              <p>No quizzes found.</p>
            )}
          </ul>

          <h3>Study Habits Analysis:</h3>
          <p>{summary.studyHabits}</p>
        </div>
      ) : (
        <p>Loading improvement data...</p>
      )}

      <h3>📌 Recommendations:</h3>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default Improvement;

