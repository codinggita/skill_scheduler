import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, CheckSquare } from "lucide-react";

const TodoComponents = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("https://skill-scheduler.onrender.com/api/planner/pending-work")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;

    fetch("https://skill-scheduler.onrender.com/api/planner/to-do", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: newTask }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks([...tasks, data]);
        setNewTask("");
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  const deleteTask = (id) => {
    fetch(`https://skill-scheduler.onrender.com/api/planner/to-do/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setTasks(tasks.filter((task) => task._id !== id));
        } else {
          console.error("Error deleting task");
        }
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  const listVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl font-semibold text-gray-800 mb-4 flex items-center space-x-2"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
      >
        <CheckSquare className="text-blue-500" />
        <span>To-Do List</span>
      </motion.h2>

      <div className="flex items-center space-x-3 mb-5">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <motion.button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <PlusCircle className="w-5 h-5" />
        </motion.button>
      </div>

      <ul className="space-y-3">
        {tasks.map((task, index) => (
          <motion.li
            key={task._id}
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">{task.task}</span>
            </div>
            <motion.button
              onClick={() => deleteTask(task._id)}
              className="text-red-500 hover:text-red-700 transition"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default TodoComponents;