import React, { useEffect, useState } from "react";

const TodoComponents = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch all to-do items
  useEffect(() => {
    fetch("https://skill-scheduler.onrender.com/api/planner/pending-work")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Add a task
  const addTask = () => {
    if (!newTask.trim()) return;

    fetch("https://skill-scheduler.onrender.com/api/planner/to-do", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: newTask }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks([...tasks, data]); // Update UI
        setNewTask("");
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  // Delete a task
  const deleteTask = (id) => {
    fetch(`https://skill-scheduler.onrender.com/api/planner/to-do/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setTasks(tasks.filter((task) => task._id !== id)); // Remove task from UI
        } else {
          console.error("Error deleting task");
        }
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">To-do List</h2>

      {/* Input Field */}
      <div className="flex items-center space-x-3 mb-5">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          +
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">{task.task}</span>
            </div>
            <button
              onClick={() => deleteTask(task._id)}
              className="text-red-500 hover:text-red-700 transition"
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoComponents;
