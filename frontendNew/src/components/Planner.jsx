import React, { useState } from "react";
import TodoList from "../pages/To-do.jsx";
import Exams from "../pages/Exam.jsx";
import StudyPlanner from "../pages/Study.jsx";

const Planner = () => {
  const [activeTab, setActiveTab] = useState("todo");

  return (
    <div className="flex h-screen bg-black text-white">
      <aside className="w-1/4 p-4 border-r border-gray-700">
        <button 
          className="w-full p-2 mb-2 bg-gray-800 hover:bg-gray-600 rounded" 
          onClick={() => setActiveTab("todo")}
        >
          To-Do List
        </button>
        <button 
          className="w-full p-2 mb-2 bg-gray-800 hover:bg-gray-600 rounded" 
          onClick={() => setActiveTab("exams")}
        >
          Exams
        </button>
        <button 
          className="w-full p-2 bg-gray-800 hover:bg-gray-600 rounded" 
          onClick={() => setActiveTab("study")}
        >
          Study Planner
        </button>
      </aside>
      <main className="flex-1 p-4">
        {activeTab === "todo" && <TodoList />}
        {activeTab === "exams" && <Exams />}
        {activeTab === "study" && <StudyPlanner />}
      </main>
    </div>
  );
};

export default Planner;
