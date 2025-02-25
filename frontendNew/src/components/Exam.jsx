import React, { useState } from "react";
import { Trash2Icon } from "lucide-react";

function Exam() {
  const [exams, setExams] = useState([
    { date: "2024-03-15", subject: "Mathematics", pending: "Chapter 5 - Calculus Review" },
    { date: "2024-03-18", subject: "Physics", pending: "Practice Problems Set 3" },
    { date: "2024-03-20", subject: "Chemistry", pending: "Lab Report Submission" },
  ]);

  const [newExam, setNewExam] = useState({
    subject: "",
    date: "",
    pending: "",
  });

  const handleAddExam = (e) => {
    e.preventDefault();
    if (newExam.subject && newExam.date && newExam.pending) {
      setExams([...exams, newExam]);
      setNewExam({ subject: "", date: "", pending: "" });
    }
  };

  const handleDelete = (index) => {
    setExams(exams.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen  text-white py-8 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-100 rounded-lg text-black shadow-2xl shadow-black/20 p-6 border border-gray-700">
          <h1 className="text-3xl font-bold  mb-2">Exam Schedule</h1>
          <p className="text-black mb-6">Manage your upcoming exams and track your study progress</p>

          <div className="mb-8">
            <form onSubmit={handleAddExam} className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Enter subject name "
                className="flex-1 min-w-[200px] px-4 py-2 bg-gray-800 border border-gray-700 rounded-md  focus:outline-none focus:ring-2 focus:ring-white-500 text-amber-50 "
                value={newExam.subject}
                onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
              />
              <input
                type="date"
                className="flex-1 min-w-[200px] px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 "
                value={newExam.date}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
              />
              <input
                type="text"
                placeholder="Enter pending tasks"
                className="flex-1 min-w-[200px] px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={newExam.pending}
                onChange={(e) => setNewExam({ ...newExam, pending: e.target.value })}
              />
              <button
                type="submit"
                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Add Exam
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-3 text-left text-black font-medium">DATE</th>
                  <th className="py-3 text-left text-black font-medium">SUBJECT</th>
                  <th className="py-3 text-left text-black font-medium">PENDING WORK</th>
                  <th className="py-3 text-left text-black font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-4 text-gray-900">{exam.date}</td>
                    <td className="py-4 text-gray-900">{exam.subject}</td>
                    <td className="py-4 text-gray-900">{exam.pending}</td>
                    <td className="py-4">
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2Icon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="mt-8 text-center text-black text-sm">
          © 2024 Study Planner. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default Exam;
