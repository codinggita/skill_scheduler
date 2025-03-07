import React, { useState, useEffect } from "react";
import NotesList from "../pages/NotesList.jsx";
import Yesterday from "../pages/Yesterday.jsx";
import Revision from "../pages/Revision.jsx";
import Improvements from "../pages/Improvement.jsx";
import ClipLoader from "react-spinners/ClipLoader";

const Notes = () => {
  const [tabState, setTabState] = useState("notes");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [tabState]);

  return (
    <div className="flex bg-gray-100 w-screen h-[calc(100vh-64px)] mt-[64px] overflow-y-auto">
      {/* Sidebar */}
      <aside className="w-64 sticky top-0 p-4 shadow-md bg-white animate-slide-in-left">
        <div className="text-blue-600 font-bold text-lg mb-6 animate-fade-in">Skill Scheduler</div>
        <nav className="space-y-2">
          {["notes", "yesterday", "revision", "improvements"].map((tab) => (
            <button
              key={tab}
              className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-300 ${
                tabState === tab
                  ? "bg-black text-white shadow-lg"
                  : "hover:bg-gray-200 text-gray-700 hover:scale-105"
              }`}
              onClick={() => setTabState(tab)}
            >
              {tab === "notes" && "📝 Notes"}
              {tab === "yesterday" && "🔄 Yesterday"}
              {tab === "revision" && "📖 Revision"}
              {tab === "improvements" && "🚀 Improvements"}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 flex justify-center items-center overflow-y-auto">
        {loading ? (
          <ClipLoader color="#000" size={50} />
        ) : (
          <div className="animate-fade-in delay-200">
            {tabState === "notes" && <NotesList />}
            {tabState === "yesterday" && <Yesterday />}
            {tabState === "revision" && <Revision />}
            {tabState === "improvements" && <Improvements />}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notes;