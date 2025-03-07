import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { BookOpen, Trash2, PlusCircle } from "lucide-react";

function Study() {
  const [studyPlans, setStudyPlans] = useState([
    {
      id: 1,
      subject: "Mathematics",
      subTitle: "Advanced Calculus",
      priority: "High",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      tasks: ["Differential equations", "Integration techniques", "Vector calculus"],
    },
    {
      id: 2,
      subject: "Physics",
      subTitle: "Quantum Mechanics",
      priority: "Medium",
      startDate: "2024-02-01",
      endDate: "2024-03-01",
      tasks: ["Wave functions", "Schrödinger equation", "Particle physics"],
    },
  ]);

  const [newPlan, setNewPlan] = useState({
    subject: "",
    startDate: "",
    endDate: "",
    priority: "High",
    tasks: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudyPlan = {
      id: Date.now(),
      ...newPlan,
      tasks: newPlan.tasks.split(",").map((task) => task.trim()),
    };
    setStudyPlans((prev) => [...prev, newStudyPlan]);
    setNewPlan({ subject: "", startDate: "", endDate: "", priority: "High", tasks: "" });
  };

  const handleDelete = (id) => {
    setStudyPlans((prev) => prev.filter((plan) => plan.id !== id));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-2xl font-bold text-gray-900 mb-1 flex items-center space-x-2"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          <BookOpen className="text-blue-500" />
          <span>Study Planner</span>
        </motion.h1>
        <motion.p
          className="text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Organize your study schedule effectively
        </motion.p>

        <motion.div
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Study Plan</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={newPlan.startDate}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={newPlan.endDate}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={newPlan.subject}
                  onChange={handleInputChange}
                  placeholder="Enter subject"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={newPlan.priority}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tasks</label>
                <input
                  type="text"
                  name="tasks"
                  value={newPlan.tasks}
                  onChange={handleInputChange}
                  placeholder="Enter tasks (separate by comma)"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <motion.button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Plan
            </motion.button>
          </form>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studyPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{plan.subject}</h3>
                  <p className="text-sm text-gray-500">{plan.subTitle}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    plan.priority === "High"
                      ? "bg-red-100 text-red-800"
                      : plan.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {plan.priority}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">Start:</span>
                  <span className="ml-2">{format(new Date(plan.startDate), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">End:</span>
                  <span className="ml-2">{format(new Date(plan.endDate), "MMM d, yyyy")}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Tasks:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {plan.tasks.map((task, index) => (
                    <li key={index} className="text-sm text-gray-600">{task}</li>
                  ))}
                </ul>
              </div>
              <motion.button
                onClick={() => handleDelete(plan.id)}
                className="mt-4 inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Study;