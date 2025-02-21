import React, { useState } from "react";
import "../styling/planner.css";
import TodoComponents from "../components/Todo";
import ExamDates from "../components/ExamDates";
import StudyPlan from "../components/StudyPlan";

const Planner = () => {
  const [tabstate, settabstate] = useState("todo");

  return (
    <div className="planner-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="menu">
          <div className={`menu-item ${tabstate === "todo" ? "active" : ""}`} onClick={() => settabstate("todo")}>
            ✅ To-do List
          </div>
          <div className={`menu-item ${tabstate === "exam" ? "active" : ""}`} onClick={() => settabstate("exam")}>
            📅 Exam Dates
          </div>
          <div className={`menu-item ${tabstate === "plan" ? "active" : ""}`} onClick={() => settabstate("plan")}>
            📖 Study Plan
          </div>
        </div>
      </div>

      <div className="outer-todo-container">
        {tabstate === "todo" && <TodoComponents />}
        {tabstate === "exam" && <ExamDates />}
        {tabstate === "plan" && <StudyPlan />}
      </div>
    </div>
  );
};

export default Planner;
