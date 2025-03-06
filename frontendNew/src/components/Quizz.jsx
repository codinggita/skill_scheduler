import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const Quizz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        // setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError("Failed to load initial quizzes");
      }
    };
    fetchQuizzes();
  }, []);

  const fetchGeneratedQuiz = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://skill-scheduler.onrender.com/api/quizz/generate-quiz",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ numQuestions: 5 }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate quiz");

      const data = await response.json();
      setQuizzes([data]);
      setSelectedAnswers({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
  
    if (quizzes.length === 0) return;
  
    try {
      const response = await fetch(
        "https://localhost:3000/api/quizz/submit-quiz",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: quizzes[0]._id,
            answers: selectedAnswers,
          }),
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit quiz");
      }
  
      alert(`Quiz Submitted! Score: ${result.score} / ${result.totalQuestions}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  return (
    <motion.div
      className="p-6 mt-12 flex flex-col justify-center items-center min-h-screen overflow-y-auto bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-3xl font-bold flex items-center space-x-2 mb-6 text-gray-800"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <CheckCircle className="text-green-500" />
        <span> Quizzes</span>
      </motion.h2>

      <motion.button
        onClick={fetchGeneratedQuiz}
        className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2" />
        ) : (
          <RefreshCw className="mr-2" />
        )}
        {loading ? "Generating..." : "Generate New Quiz"}
      </motion.button>

      {error && (
        <motion.p
          className="text-red-500 flex items-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <XCircle className="mr-2" />
          {error}
        </motion.p>
      )}

      {quizzes.length > 0 && (
        <motion.div
          className="w-full max-w-2xl mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmitQuiz}>
            {quizzes.map((quiz, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white rounded-xl shadow-lg mb-6 border border-gray-200"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-semibold text-xl mb-4 text-gray-800">
                  {quiz.title}
                </h3>
                {quiz.questions?.map((q, qIndex) => (
                  <motion.div
                    key={qIndex}
                    className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-gray-700 mb-3 font-medium">
                      {qIndex + 1}. {q.question}
                    </p>
                    <div className="space-y-3">
                      {q.options?.map((option, oIndex) => (
                        <label
                          key={oIndex}
                          className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={option}
                            checked={selectedAnswers[qIndex] === option}
                            onChange={() => handleAnswerChange(qIndex, option)}
                            className="form-radio h-5 w-5 text-blue-600"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )) || (
                  <p className="text-red-500 flex items-center">
                    <XCircle className="mr-2" /> No questions available
                  </p>
                )}
              </motion.div>
            ))}
            <motion.button
              type="submit"
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg w-full max-w-xs shadow-md hover:bg-green-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Quiz
            </motion.button>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Quizz;