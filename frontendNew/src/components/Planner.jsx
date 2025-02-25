import React, { useState } from "react";
import ToDo from "../pages/To-do.jsx";
import Exam from "../components/Exam.jsx";
import Study from "../components/Study.jsx";

const Planner = () => {
  const [tabState, setTabState] = useState("todo");

  return (
    <div className="flex  text-white w-screen h-[calc(100vh-64px)] mt-[64px] overflow-y-auto">
      {/* Sidebar */}
      <div className="w-[224px] bg-white text-black  p-[16px] flex flex-col space-y-4 sticky top-0">
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
      <div className="w-full p-6  rounded-lg shadow-lg flex justify-center">
        {tabState === "todo" && <ToDo />}
        {tabState === "exam" && <Exam />}
        {tabState === "plan" && <Study />}
      </div>
    </div>
  );
};

export default Planner;
