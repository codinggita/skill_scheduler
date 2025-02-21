// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../styling/quizzes.css"; // Ensure the correct path

// const API_BASE_URL = "https://skill-scheduler.onrender.com/api/quizzes";

// const QuizSection = () => {
//     const [quizzes, setQuizzes] = useState([]);
//     const [selectedAnswers, setSelectedAnswers] = useState({});
//     const [startTime, setStartTime] = useState(null);
//     const [timeTaken, setTimeTaken] = useState(null);
//     const [currentQuizId, setCurrentQuizId] = useState(null);

//     // ✅ Fetch Quizzes on Component Mount
//     useEffect(() => {
//         fetchQuizzes();
//     }, []);

//     const fetchQuizzes = async () => {
//         try {
//             const response = await axios.get("https://skill-scheduler.onrender.com/api/quizzes");
//             setQuizzes(response.data);

//             // ✅ If no quizzes exist, show the "No Quiz" message
//             if (response.data.length === 0) {
//                 setCurrentQuizId(null);
//             } else {
//                 setCurrentQuizId(response.data[0]._id);
//             }
//         } catch (error) {
//             console.error("Error fetching quizzes:", error);
//         }
//     };

//     // ✅ Start the Quiz Timer
//     const startQuiz = () => {
//         if (quizzes.length === 0) {
//             alert("No quiz can be generated. Please create some notes first!");
//             return;
//         }

//         setStartTime(Date.now());
//         setTimeTaken(null); // Reset timer display
//     };

//     // ✅ Handle Answer Selection
//     const handleAnswerSelect = (questionId, answer) => {
//         setSelectedAnswers({
//             ...selectedAnswers,
//             [questionId]: answer,
//         });
//     };

//     // ✅ Submit the Quiz
//     const submitQuiz = async () => {
//         if (!startTime) {
//             alert("Start the quiz first!");
//             return;
//         }

//         const endTime = Date.now();
//         const timeSpent = (endTime - startTime) / 1000; // Convert to seconds

//         try {
//             await axios.post(`${API_BASE_URL}/submit-quiz`, {
//                 quizId: currentQuizId,
//                 userAnswers: selectedAnswers,
//                 startTime,
//             });

//             setTimeTaken(timeSpent); // Update UI with time taken
//         } catch (error) {
//             console.error("Error submitting quiz:", error);
//         }
//     };

//     return (
//         <div className="quiz-container">
//             <h2 className="quiz-title">Quiz Section</h2>

//             {/* ✅ Check if quizzes are available */}
//             {quizzes.length === 0 ? (
//                 <p className="no-quiz-message">No quiz can be generated. Please create some notes first.</p>
//             ) : (
//                 <>
//                     {/* ✅ Start Quiz Button */}
//                     <button className="start-btn" onClick={startQuiz}>Start Quiz</button>

//                     {/* ✅ Display Quizzes */}
//                     <ul className="quiz-list">
//                         {quizzes.map((quiz) => (
//                             <li key={quiz._id} className="quiz-item">
//                                 <p><strong>Question:</strong> {quiz.question}</p>
//                                 <div>
//                                     {quiz.options.map((option, index) => (
//                                         <label key={index}>
//                                             <input
//                                                 type="radio"
//                                                 name={`quiz-${quiz._id}`}
//                                                 value={option}
//                                                 onChange={() => handleAnswerSelect(quiz._id, option)}
//                                             />
//                                             {option}
//                                         </label>
//                                     ))}
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>

//                     {/* ✅ Submit Quiz Button */}
//                     <button className="submit-btn" onClick={submitQuiz}>Submit Quiz</button>

//                     {/* ✅ Display Time Taken */}
//                     {timeTaken !== null && <p className="time-taken">Time Taken: {timeTaken} seconds</p>}
//                 </>
//             )}
//         </div>
//     );
// };

// export default QuizSection;


import React, { useState } from "react";
import axios from "axios";


const API_BASE_URL = "https://skill-scheduler.onrender.com/api/quizzes";

const QuizSection = () => {
    const [quizData, setQuizData] = useState(null);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Generate Quiz using OpenAI API
    const generateQuiz = async () => {
        if (!notes.trim()) {
            alert("Please enter your study notes!");
            return;
        }

        setLoading(true);
        // try {
        //     const response = await axios.post(`${API_BASE_URL}/generate-quiz`, { notes });
        //     setQuizData(response.data.quiz);
        // } catch (error) {
        //     console.error("Error generating quiz:", error);
        // }
        // setLoading(false);
        try {
            console.log("Sending request to:", `${API_BASE_URL}/generate-quiz`);
            const response = await axios.post(`${API_BASE_URL}/generate-quiz`, { notes });
            console.log("Response received:", response.data);
            setQuizData(response.data.quiz);
        } catch (error) {
            console.error("Error generating quiz:", error.response ? error.response.data : error.message);
            alert("Failed to generate quiz. Check console for details.");
        }
        setLoading(false);
    };

    return (
        <div className="quiz-container">
            <h2 className="quiz-title">Quiz Generator</h2>

            {/* ✅ Input for Notes */}
            <textarea
                className="notes-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your notes here..."
            ></textarea>

            {/* ✅ Generate Quiz Button */}
            <button className="generate-btn" onClick={generateQuiz} disabled={loading}>
                {loading ? "Generating..." : "Generate Quiz"}
            </button>

            {/* ✅ Display Generated Quiz */}
            {quizData && (
                <div className="quiz-section">
                    <h3>Generated Quiz</h3>
                    <pre>{quizData}</pre>
                </div>
            )}
        </div>
    );
};

export default QuizSection;
