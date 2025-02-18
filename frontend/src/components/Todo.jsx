import React, { useEffect, useState } from "react";
import '../styling/todo.css'
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
    <div  >
      {/* Main Content */}
      <div className="main-content" >
        <h2>To-do list</h2>
        <div className="task-input">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
          />
          <button onClick={addTask}>Add</button>
        </div>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id}>
              <input type="checkbox" /> {task.task}
              <button onClick={() => deleteTask(task._id)} >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoComponents;
