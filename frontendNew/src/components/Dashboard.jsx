import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Dashboard = () => {
  const [progress, setProgress] = useState(0);
  const [studyHours, setStudyHours] = useState(0);
  const [quizProgress, setQuizProgress] = useState(0);
  const [notes, setNotes] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("https://skill-scheduler.onrender.com/api/dashboard/progress")
        .then((response) => response.json())
        .then((data) => {
          setProgress(data.completion || 0);
          setStudyHours(data.studiedHours || 0);
          setQuizProgress(data.quizProgress || 0);
        }),

      fetch("https://skill-scheduler.onrender.com/api/dashboard/dashboard")
        .then((response) => response.json())
        .then((data) => setNotes(data.notesOverview || [])),

      fetch("https://skill-scheduler.onrender.com/api/dashboard/upcoming-exams")
        .then((response) => response.json())
        .then((data) => setUpcomingExams(data || [])),
    ])
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-600 text-white p-6 flex flex-col items-center w-screen h-[calc(100vh-64px)] mt-[64px] overflow-y-auto">
      <h1 className="text-3xl font-bold">Welcome to Skill Scheduler</h1>
      <p className="text-lg text-gray-400 mt-2">Focus Forward</p>

      {/* Show Loader while loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#ffffff" size={50} />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mt-6">
          <div className="bg-gray-900 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">Progress Overview</h3>
            <div className="relative w-24 h-24 mx-auto rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-2xl">{studyHours}Hr</span>
            </div>
            <p className="mt-2">Your Progress</p>
            <div className="mt-4">
              <p className="text-sm">Quiz Progress</p>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-1">
                <div className="bg-white h-2 rounded-full" style={{ width: `${quizProgress}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Points from Notes</h3>
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <p key={index} className="text-gray-300 text-sm border-b border-gray-700 py-2">{note.content}</p>
              ))
            ) : (
              <p className="text-gray-400">No notes available.</p>
            )}
          </div>

          <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Exam Priority</h3>
            <ul>
              {upcomingExams.length > 0 ? (
                upcomingExams.map((exam, index) => (
                  <li key={index} className="text-gray-300 py-1">{exam.subject} - {exam.date}</li>
                ))
              ) : (
                <p className="text-gray-400">No upcoming exams.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
