import React, { useEffect, useState } from 'react'

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
            setTasks([...tasks, data]);
            setNewTask("");
          })
          .catch((err) => console.error("Error adding task:", err));
      };

  return (
    <div style={{width:"100%"}}>
      {/* Main Content */}
      <div className="main-content" style={{width:"100%"}}>
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
          {tasks.map((task, index) => (
            <li key={index}>
              <input type="checkbox" /> {task.task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TodoComponents
