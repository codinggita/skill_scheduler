import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    progress: 0,
    studyHours: 0,
    quizProgress: 0,
    notes: [],
    exams: [],
    quizStats: null,
    quizHistory: []
  });
  const [loading, setLoading] = useState(true);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showQuizDetails, setShowQuizDetails] = useState(false);

  const MAX_NOTES_TO_SHOW = 3;

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [progressRes, dashboardRes, examsRes, quizRes] = await Promise.all([
        fetch("https://skill-scheduler.onrender.com/api/dashboard/progress"),
        fetch("https://skill-scheduler.onrender.com/api/dashboard/dashboard"),
        fetch("https://skill-scheduler.onrender.com/api/dashboard/upcoming-exams"),
        fetch("https://skill-scheduler.onrender.com/api/dashboard/quiz-performance")
      ]);

      // Process all responses
      const progressData = await progressRes.json();
      const dashboardData = await dashboardRes.json();
      const examsData = (await examsRes.json()).sort((a, b) => new Date(a.date) - new Date(b.date));
      const quizData = await quizRes.json();

      // Check for quiz redirect
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('fromQuiz') === 'true') {
        window.history.replaceState({}, document.title, window.location.pathname);
        setShowQuizDetails(true);
      }

      // Update state
      setDashboardData({
        progress: progressData.completion || 0,
        studyHours: progressData.studiedHours || 0,
        quizProgress: progressData.quizProgress || 0,
        notes: dashboardData.notesOverview || [],
        exams: examsData || [],
        quizStats: quizData.stats || null,
        quizHistory: quizData.history || []
      });

      // Update localStorage as fallback
      if (quizData.history?.length > 0) {
        localStorage.setItem('quizHistory', JSON.stringify(quizData.history));
        localStorage.setItem('quizProgress', quizData.stats?.averageScore || 0);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback to localStorage
      const storedHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
      const storedProgress = localStorage.getItem('quizProgress') || 0;
      
      setDashboardData(prev => ({
        ...prev,
        quizHistory: storedHistory,
        quizProgress: storedProgress,
        quizStats: storedHistory.length > 0 ? {
          averageScore: storedProgress,
          totalQuizzes: storedHistory.length,
          totalCorrect: storedHistory.reduce((sum, q) => sum + q.correctAnswers, 0),
          totalQuestions: storedHistory.reduce((sum, q) => sum + q.totalQuestions, 0),
          accuracy: Math.round(
            (storedHistory.reduce((sum, q) => sum + q.correctAnswers, 0) / 
            storedHistory.reduce((sum, q) => sum + q.totalQuestions, 1) * 100
          )
        )
        } : null
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000); // 5 min refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 text-black p-6 flex flex-col items-center w-screen h-[calc(100vh-64px)] mt-[64px] overflow-y-auto">
      <h1 className="text-3xl font-bold animate-fade-in">Welcome to Skill Scheduler</h1>
      <p className="text-lg text-gray-500 mt-2 animate-fade-in delay-200">Focus Forward</p>
      
      {lastUpdate && (
        <p className="text-sm text-gray-400 mt-1">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      )}
      
      <button 
        onClick={fetchDashboardData}
        className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
      >
        Refresh Dashboard
      </button>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#000000" size={50} />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mt-6">
          {/* Progress Overview Card */}
          <div className="bg-black p-6 rounded-lg shadow-md text-center transform transition-all hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-white animate-slide-up">Progress Overview</h3>
            <div 
              className="relative w-24 h-24 mx-auto rounded-full border-4 border-gray-300 flex items-center justify-center animate-spin-slow cursor-pointer"
              onClick={() => setShowQuizDetails(!showQuizDetails)}
            >
              <span className="text-2xl text-white">{dashboardData.studyHours}Hr</span>
            </div>
            <p className="mt-2 text-gray-300">Your Progress</p>
            <div className="mt-4">
              <p className="text-sm text-gray-300">Quiz Progress</p>
              <div className="w-full bg-gray-700 h-3 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-white h-3 rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${dashboardData.quizProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-white mt-1">{dashboardData.quizProgress}%</p>
              
              <button
                onClick={() => setShowQuizDetails(!showQuizDetails)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors w-full"
              >
                {showQuizDetails ? "Hide Quiz Details" : "View Quiz Performance"}
              </button>
            </div>
          </div>

          {/* Quiz Details Card */}
          {showQuizDetails && (
            <div className="md:col-span-2 bg-black p-6 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-white animate-slide-up">Quiz Performance</h3>
              
              {dashboardData.quizHistory.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-800 p-3 rounded-lg text-center">
                      <p className="text-gray-400 text-xs">Quizzes Taken</p>
                      <p className="text-white text-xl font-bold">{dashboardData.quizStats?.totalQuizzes || 0}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg text-center">
                      <p className="text-gray-400 text-xs">Average Score</p>
                      <p className="text-white text-xl font-bold">{dashboardData.quizStats?.averageScore || 0}%</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg text-center">
                      <p className="text-gray-400 text-xs">Questions Correct</p>
                      <p className="text-white text-xl font-bold">
                        {dashboardData.quizStats?.totalCorrect || 0}/{dashboardData.quizStats?.totalQuestions || 0}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg text-center">
                      <p className="text-gray-400 text-xs">Accuracy</p>
                      <p className="text-white text-xl font-bold">{dashboardData.quizStats?.accuracy || 0}%</p>
                    </div>
                  </div>
                  
                  <h4 className="text-white font-medium mb-2">Recent Quiz Results</h4>
                  <div className="overflow-auto max-h-40">
                    <table className="w-full">
                      <thead className="text-gray-400 text-xs">
                        <tr>
                          <th className="text-left pb-2">Date</th>
                          <th className="text-center pb-2">Score</th>
                          <th className="text-center pb-2">Correct</th>
                          <th className="text-center pb-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.quizHistory.slice(-5).reverse().map((quiz, index) => (
                          <tr key={index} className="border-t border-gray-700">
                            <td className="text-gray-300 text-sm py-2">
                              {new Date(quiz.date).toLocaleDateString()}
                            </td>
                            <td className="text-gray-300 text-sm py-2 text-center">
                              {quiz.score}%
                            </td>
                            <td className="text-gray-300 text-sm py-2 text-center">
                              {quiz.correctAnswers}
                            </td>
                            <td className="text-gray-300 text-sm py-2 text-center">
                              {quiz.totalQuestions}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No quiz data available yet.</p>
                  <p className="text-gray-500 text-sm mt-2">Complete quizzes to see your performance.</p>
                </div>
              )}
            </div>
          )}

          {/* Notes Card */}
          {!showQuizDetails && (
            <div className="bg-black p-6 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-2 text-white animate-slide-up">Points from Notes</h3>
              {dashboardData.notes.length > 0 ? (
                <>
                  {dashboardData.notes.slice(0, showAllNotes ? dashboardData.notes.length : MAX_NOTES_TO_SHOW).map((note, index) => (
                    <p key={index} className="text-gray-300 text-sm border-b border-gray-700 py-2 animate-fade-in delay-100">
                      {note.content}
                    </p>
                  ))}
                  {dashboardData.notes.length > MAX_NOTES_TO_SHOW && (
                    <button
                      onClick={() => setShowAllNotes(!showAllNotes)}
                      className="text-gray-400 text-sm mt-2 hover:text-white focus:outline-none transition-colors duration-300"
                    >
                      {showAllNotes ? "See Less" : "See More..."}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-gray-400">No notes available.</p>
              )}
            </div>
          )}

          {/* Exams Card */}
          {!showQuizDetails && (
            <div className="bg-black p-6 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-2 text-white animate-slide-up">Exam Priority</h3>
              <ul>
                {dashboardData.exams.length > 0 ? (
                  dashboardData.exams.map((exam, index) => (
                    <li key={index} className="text-gray-300 py-1 hover:text-white transition-colors duration-300 cursor-pointer animate-fade-in delay-100">
                      {exam.subject} - {exam.date}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400">No upcoming exams.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;