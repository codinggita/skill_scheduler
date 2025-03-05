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
      console.log("Submitted answers:", answers);
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
          <div key={index} className="mb-6">
            <p className="font-semibold">
              {index + 1}. {q.question}
            </p>
            {q.options?.map((option, optIndex) => (
              <div key={optIndex} className="ml-4">
                <input
                  type="radio"
                  id={`${index}-${optIndex}`}
                  name={`question-${index}`}
                  value={option}
                  onChange={() => handleOptionChange(q._id || index, option)}
                  checked={answers[q._id || index] === option}
                />
                <label htmlFor={`${index}-${optIndex}`} className="ml-2">
                  {option}
                </label>
              </div>
            )) || <p className="text-red-500">No options available.</p>}
          </div>
        ))}
        {/* Single Submit Button at the Bottom */}
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