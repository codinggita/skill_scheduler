import { useState } from 'react';
import { Trash2Icon } from 'lucide-react';

function Exam() {
  const [exams, setExams] = useState([
    { date: '2024-03-15', subject: 'Mathematics', pending: 'Chapter 5 - Calculus Review' },
    { date: '2024-03-18', subject: 'Physics', pending: 'Practice Problems Set 3' },
    { date: '2024-03-20', subject: 'Chemistry', pending: 'Lab Report Submission' },
  ]);

  const [newExam, setNewExam] = useState({
    subject: '',
    date: '',
    pending: ''
  });

  const handleAddExam = (e) => {
    e.preventDefault();
    if (newExam.subject && newExam.date && newExam.pending) {
      setExams([...exams, newExam]);
      setNewExam({ subject: '', date: '', pending: '' });
    }
  };

  const handleDelete = (index) => {
    setExams(exams.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Schedule</h1>
          <p className="text-gray-600 mb-6">Manage your upcoming exams and track your study progress</p>

          <div className="mb-8">
            <form onSubmit={handleAddExam} className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Enter subject name"
                className="flex-1 min-w-[200px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newExam.subject}
                onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
              />
              <input
                type="date"
                className="flex-1 min-w-[200px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newExam.date}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
              />
              <input
                type="text"
                placeholder="Enter pending tasks"
                className="flex-1 min-w-[200px] px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newExam.pending}
                onChange={(e) => setNewExam({ ...newExam, pending: e.target.value })}
              />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Add Exam
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left text-gray-500 font-medium">DATE</th>
                  <th className="py-3 text-left text-gray-500 font-medium">SUBJECT</th>
                  <th className="py-3 text-left text-gray-500 font-medium">PENDING WORK</th>
                  <th className="py-3 text-left text-gray-500 font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4">{exam.date}</td>
                    <td className="py-4">{exam.subject}</td>
                    <td className="py-4">{exam.pending}</td>
                    <td className="py-4">
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-700"
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

        <footer className="mt-8 text-center text-gray-500 text-sm">
          © 2024 Study Planner. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default Exam;