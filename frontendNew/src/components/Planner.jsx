import React, { useState, useEffect } from "react";
import ToDo from "../pages/To-do.jsx";
import Exam from "../pages/Exam.jsx";
import Study from "../pages/Study.jsx";
import ClipLoader from "react-spinners/ClipLoader";

const Planner = () => {
  const [tabState, setTabState] = useState("todo");
  const [loading, setLoading] = useState(false);

  // Simulating a loading delay when switching tabs
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust time as needed
    return () => clearTimeout(timer);
  }, [tabState]);

  return (
    <div className="flex text-white w-screen h-[calc(100vh-64px)] pt-[64px] overflow-y-auto">
      {/* Sidebar */}
      <div className="w-[224px] bg-white text-black p-[16px] flex flex-col space-y-4 sticky top-0">
        <h2 className="text-2xl font-bold mb-6">Skill Scheduler</h2>
        <div className="space-y-3">
          <button 
            className={`w-full p-3 rounded-lg text-left transition duration-300 
              ${tabState === "todo" ? "bg-gray-200" : "hover:bg-gray-200"}`} 
            onClick={() => setTabState("todo")}
          >
            ✅ To-Do List
          </button>
          <button 
            className={`w-full p-3 rounded-lg text-left transition duration-300 
              ${tabState === "exam" ? "bg-gray-200" : "hover:bg-gray-200"}`} 
            onClick={() => setTabState("exam")}
          >
            📅 Exam Dates
          </button>
          <button 
            className={`w-full p-3 rounded-lg text-left transition duration-300 
              ${tabState === "plan" ? "bg-gray-200" : "hover:bg-gray-200"}`} 
            onClick={() => setTabState("plan")}
          >
            📖 Study Plan
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full p-6 rounded-lg shadow-lg flex justify-center overscroll-y-auto">
        {loading ? (
          <ClipLoader color="#4A90E2" size={50} />
        ) : (
          <>
            {tabState === "todo" && <ToDo />}
            {tabState === "exam" && <Exam />}
            {tabState === "plan" && <Study />}
          </>
        )}
      </div>
    </div>
  );
};

export default Planner;
