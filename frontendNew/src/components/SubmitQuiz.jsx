// frontend/SubmitQuiz.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SubmitQuiz = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { quizCode, quiz } = state || {};
  const [answers, setAnswers] = useState({});

  const handleOptionChange = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://skill-scheduler.onrender.com/api/quiz/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: quiz._id, answers }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const result = await response.json();
      alert(`Quiz submitted! Your score: ${result.score}/${result.totalQuestions}`);
      navigate("/quizzes"); // Redirect after submission
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (!quiz) {
    return <p className="text-red-500">No quiz data available.</p>;
  }

  return (
    <div className="p-6 flex flex-col justify-center items-center overflow-y-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Submit Quiz</h2>
      <p className="mb-4">Quiz Code: <strong>{quizCode}</strong></p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        {quiz.questions?.map((q, index) => (
          <div key={q._id} className="mb-6">
            <p className="font-semibold">
              {index + 1}. {q.question}
            </p>
            {q.options?.map((option, optIndex) => (
              <div key={optIndex} className="ml-4">
                <input
                  type="radio"
                  id={`${q._id}-${optIndex}`}
                  name={`question-${q._id}`}
                  value={option}
                  onChange={() => handleOptionChange(q._id, option)}
                  checked={answers[q._id] === option}
                />
                <label htmlFor={`${q._id}-${optIndex}`} className="ml-2">
                  {option}
                </label>
              </div>
            )) || <p className="text-red-500">No options available.</p>}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full max-w-xs"
        >
          Submit Answers
        </button>
      </form>
    </div>
  );
};

export default SubmitQuiz;
