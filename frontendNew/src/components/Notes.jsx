import React, { useState } from "react";
import NotesList from "../components/NotesList.jsx";
import Yesterday from "../pages/Yesterday.jsx";
import Revision from "../components/Revision.jsx";
import Improvements from "../pages/Improvement.jsx";

const Notes = () => {
  const [tabState, setTabState] = useState("notes");

  return (
    <div className="flex bg-gray-100 w-screen h-[calc(100vh-64px)] mt-[64px] overflow-y-auto">
      {/* Sidebar */}
      <aside className="w-64 sticky top-0 p-4 shadow-md bg-white">
        <div className="text-blue-600 font-bold text-lg mb-6">Skill Scheduler</div>
        <nav className="space-y-2">
          <button
            className={`w-full flex items-center p-3 rounded-lg text-left ${
              tabState === "notes"
                ? "bg-black text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setTabState("notes")}
          >
            📝 Notes
          </button>
          <button
            className={`w-full flex items-center p-3 rounded-lg text-left ${
              tabState === "yesterday"
                ? "bg-black text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setTabState("yesterday")}
          >
            🔄 Yesterday
          </button>
          <button
            className={`w-full flex items-center p-3 rounded-lg text-left ${
              tabState === "revision"
                ? "bg-black text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setTabState("revision")}
          >
            📖 Revision
          </button>
          <button
            className={`w-full flex items-center p-3 rounded-lg text-left ${
              tabState === "improvements"
                ? "bg-black text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setTabState("improvements")}
          >
            🚀 Improvements
          </button>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6">
        {tabState === "notes" && <NotesList />}
        {tabState === "yesterday" && <Yesterday />}
        {tabState === "revision" && <Revision />}
        {tabState === "improvements" && <Improvements />}
      </main>
    </div>
  );
};

export default Notes;
