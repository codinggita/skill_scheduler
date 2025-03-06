import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Trash2, PlusCircle } from "lucide-react";
// Optional: If using npm fontsource
import "@fontsource/roboto";

function Exam() {
  const [exams, setExams] = useState([
    { date: "2024-03-15", subject: "Mathematics", pending: "Chapter 5 - Calculus Review" },
    { date: "2024-03-18", subject: "Physics", pending: "Practice Problems Set 3" },
    { date: "2024-03-20", subject: "Chemistry", pending: "Lab Report Submission" },
  ]);

  const [newExam, setNewExam] = useState({ subject: "", date: "", pending: "" });

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

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="py-8 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "Roboto, sans-serif" }} // Apply font here
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-gray-800 flex items-center space-x-2">
            <Calendar className="text-red-500" />
            <span>Exam Schedule</span>
          </h1>
          <p className="text-gray-600 mb-6">Manage your upcoming exams and track your study progress</p>

          <motion.form
            onSubmit={handleAddExam}
            className="flex flex-wrap gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="text"
              placeholder="Enter subject name"
              className="flex-1 min-w-[200px] px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={newExam.subject}
              onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
            />
            <input
              type="date"
              className="flex-1 min-w-[200px] px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={newExam.date}
              onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
            />
            <input
              type="text"
              placeholder="Enter pending tasks"
              className="flex-1 min-w-[200px] px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={newExam.pending}
              onChange={(e) => setNewExam({ ...newExam, pending: e.target.value })}
            />
            <motion.button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusCircle className="w-5 h-5" />
            </motion.button>
          </motion.form>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-3 text-left text-gray-800 font-medium">DATE</th>
                  <th className="py-3 text-left text-gray-800 font-medium">SUBJECT</th>
                  <th className="py-3 text-left text-gray-800 font-medium">PENDING WORK</th>
                  <th className="py-3 text-left text-gray-800 font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => (
                  <motion.tr
                    key={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200"
                  >
                    <td className="py-4 text-gray-700">{exam.date}</td>
                    <td className="py-4 text-gray-700">{exam.subject}</td>
                    <td className="py-4 text-gray-700">{exam.pending}</td>
                    <td className="py-4">
                      <motion.button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-700"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.footer
          className="mt-8 text-center text-gray-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          © 2024 Study Planner. All rights reserved.
        </motion.footer>
      </div>
    </motion.div>
  );
}

export default Exam;