// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react";
// import { motion } from "framer-motion";

// const Quizz = () => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         const response = await fetch(
//           "https://skill-scheduler.onrender.com/api/quizz/quizzes"
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         // setQuizzes(data);
//       } catch (error) {
//         console.error("Error fetching quizzes:", error);
//         setError("Failed to load initial quizzes");
//       }
//     };
//     fetchQuizzes();
//   }, []);

//   const fetchGeneratedQuiz = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await fetch(
//         "https://skill-scheduler.onrender.com/api/quizz/api/quizz/generate-quiz",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ numQuestions: 5 }),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to generate quiz");

//       const data = await response.json();
//       setQuizzes([data]);
//       setSelectedAnswers({});
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAnswerChange = (questionIndex, answer) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [questionIndex]: answer,
//     }));
//   };

//   const handleSubmitQuiz = (e) => {
//     e.preventDefault();

    
//     console.log("Submitting Quiz Data:", {
//       quizId: quizzes[0]?._id || `QUIZ-${Date.now()}`,
//       answers: selectedAnswers,
//     });

//     setQuizzes([{
//       quizId: quizzes[0]?._id || `QUIZ-${Date.now()}`,
//       answers: selectedAnswers,
//     }])

//     console.log(quizzes )
    
  
//     if (!`QUIZ-${Date.now()}` || Object.keys(selectedAnswers).length === 0) {
//       console.error("Quiz ID or answers are missing!");
//       setError("Please answer all questions before submitting.");
//       return;
//     }
  
//     // navigate("./SubmitQuiz", {
//     //   state: {
//     //     quizCode: quizzes[0]._id || `QUIZ-${Date.now()}`,
//     //     quiz: quizzes[0],
//     //     answers: selectedAnswers,
//     //   },
//     // });
//   };
  
//   return (
//     <motion.div
//       className="p-6 mt-12 flex flex-col justify-center items-center min-h-screen overflow-y-auto bg-gray-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <motion.h2
//         className="text-3xl font-bold flex items-center space-x-2 mb-6 text-gray-800"
//         initial={{ y: -20 }}
//         animate={{ y: 0 }}
//       >
//         <CheckCircle className="text-green-500" />
//         <span> Quizzes</span>
//       </motion.h2>

//       <motion.button
//         onClick={fetchGeneratedQuiz}
//         className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
//         disabled={loading}
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         {loading ? (
//           <Loader2 className="animate-spin mr-2" />
//         ) : (
//           <RefreshCw className="mr-2" />
//         )}
//         {loading ? "Generating..." : "Generate New Quiz"}
//       </motion.button>

//       {error && (
//         <motion.p
//           className="text-red-500 flex items-center mt-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           <XCircle className="mr-2" />
//           {error}
//         </motion.p>
//       )}

//       {quizzes.length > 0 && (
//         <motion.div
//           className="w-full max-w-2xl mt-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <form onSubmit={handleSubmitQuiz}>
//             {quizzes.map((quiz, index) => (
//               <motion.div
//                 key={index}
//                 className="p-6 bg-white rounded-xl shadow-lg mb-6 border border-gray-200"
//                 whileHover={{ scale: 1.02 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <h3 className="font-semibold text-xl mb-4 text-gray-800">
//                   {quiz.title}
//                 </h3>
//                 {quiz.questions?.map((q, qIndex) => (
//                   <motion.div
//                     key={qIndex}
//                     className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
//                     whileHover={{ x: 5 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <p className="text-gray-700 mb-3 font-medium">
//                       {qIndex + 1}. {q.question}
//                     </p>
//                     <div className="space-y-3">
//                       {q.options?.map((option, oIndex) => (
//                         <label
//                           key={oIndex}
//                           className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//                         >
//                           <input
//                             type="radio"
//                             name={`question-${qIndex}`}
//                             value={option}
//                             checked={selectedAnswers[qIndex] === option}
//                             onChange={() => handleAnswerChange(qIndex, option)}
//                             className="form-radio h-5 w-5 text-blue-600"
//                           />
//                           <span className="text-gray-700">{option}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </motion.div>
//                 )) }
//               </motion.div>
//             ))}
//             <motion.button
//               type="submit"
//               className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg w-full max-w-xs shadow-md hover:bg-green-700 transition-all duration-300"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Submit Quiz
//             </motion.button>
//           </form>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

// export default Quizz;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const Quizz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
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
    setSuccess("");
    setShowResults(false);
    setResults(null);
    try {
      const response = await fetch(
        "https://skill-scheduler.onrender.com/api/quizz/api/quizz/generate-quiz",
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
    setSubmitting(true);
    setError("");
    setSuccess("");
  
    const quizId = quizzes[0]?._id || `QUIZ-${Date.now()}`;
  
    if (!quizId || Object.keys(selectedAnswers).length === 0) {
      console.error("Quiz ID or answers are missing!");
      setError("Please answer all questions before submitting.");
      setSubmitting(false);
      return;
    }
  
    try {
      // ✅ Make sure the API endpoint matches your backend
      const response = await fetch("https://skill-scheduler.onrender.com/api/quizz/check-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quizId,
          answers: selectedAnswers,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to check answers via API");
      }
  
      const quizResults = await response.json();
      setResults(quizResults);
      setShowResults(true);
      setSuccess("Quiz checked successfully!");
    } catch (err) {
      console.error("Error checking quiz:", err);
      setError("Failed to check answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  
  
  const goToDashboard = () => {
    // Add fromQuiz parameter to indicate we're coming from quiz completion
    navigate("/dashboard?fromQuiz=true");
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
        disabled={loading || submitting}
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
      
      {success && (
        <motion.p
          className="text-green-500 flex items-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CheckCircle className="mr-2" />
          {success}
        </motion.p>
      )}
      
      {/* Results Section */}
      {showResults && results && (
        <motion.div
          className="w-full max-w-2xl mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-center mb-4">Quiz Results</h3>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600">{results.score}%</div>
              <div className="text-gray-500 mt-2">Score</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600">{results.correctAnswers}</div>
              <div className="text-gray-500 mt-2">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600">{results.wrongAnswers}</div>
              <div className="text-gray-500 mt-2">Wrong</div>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            {Object.keys(results.answerDetails).map((questionIndex) => {
              const detail = results.answerDetails[questionIndex];
              return (
                <div 
                  key={questionIndex}
                  className={`p-3 rounded-lg border ${detail.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                >
                  <p className="font-medium">Question {parseInt(questionIndex) + 1}</p>
                  <div className="flex flex-col sm:flex-row justify-between mt-1 text-sm">
                    <div>
                      <span className="font-medium">Your answer:</span> {detail.userAnswer}
                    </div>
                    {!detail.isCorrect && (
                      <div>
                        <span className="font-medium">Correct answer:</span> {detail.correctAnswer}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <motion.button
            onClick={goToDashboard}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg w-full shadow-md hover:bg-blue-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Progress on Dashboard
          </motion.button>
        </motion.div>
      )}

      {/* Quiz Form */}
      {quizzes.length > 0 && !showResults && (
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
                  {quiz.title || "Practice Quiz"}
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
                ))}
              </motion.div>
            ))}
            <motion.button
              type="submit"
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg w-full max-w-xs shadow-md hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin inline mr-2" />
                  Checking...
                </>
              ) : (
                "Submit Quiz"
              )}
            </motion.button>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Quizz;