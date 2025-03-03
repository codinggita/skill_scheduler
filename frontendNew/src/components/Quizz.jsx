import React, { useState, useEffect } from "react";

const Quizz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ✅ Define error state

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(
          "https://skill-scheduler.onrender.com/api/quizz/quizzes"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    // setLoading(true);
    fetchQuizzes();
  }, []);

  const fetchGeneratedQuiz = async () => {
    setLoading(true);
    setError(""); // ✅ Reset error before request

    try {
      const response = await fetch(
        "https://skill-scheduler.onrender.com/api/quizz/generate-quiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ numQuestions: 5 }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quiz");
      }

      const data = await response.json();
      setQuizzes([data]); // ✅ Store as an array
    } 
    catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mt-15 flex flex-col justify-center items-center overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Quizzes</h2>
      <button
        onClick={fetchGeneratedQuiz}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Generating..." : "Generate New Quiz"}
      </button>

      {error && <p className="text-red-500">{error}</p>} {/* ✅ Show error message */}

      <ul>
        {quizzes.map((quiz, index) => (
          <li
            key={index}
            className="p-4 bg-gray-100 rounded-lg shadow-md mb-2   "          >
            <h3 className="font-semibold">{quiz.title}</h3>
            <ul className="mt-2">
              {quiz.questions?.map((q, qIndex) => (
                <li key={qIndex} className="text-gray-700">
                  {qIndex + 1}. {q.question}
                </li>
              )) || <li className="text-red-500">No questions available.</li>}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quizz;
