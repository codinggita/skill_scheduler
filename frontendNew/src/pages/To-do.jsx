import { useState } from 'react'

function ToDo() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete project documentation', completed: false },
    { id: 2, text: 'Review pull requests', completed: false },
    { id: 3, text: 'Schedule team meeting', completed: false },
    { id: 4, text: 'Update dependencies', completed: false }
  ])
  const [newTask, setNewTask] = useState('')

  const addTask = (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        completed: false
      }
    ])
    setNewTask('')
  }

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8">Task Manager</h1>
        
        <form onSubmit={addTask} className="mb-6 flex gap-2">
  <input
    type="text"
    value={newTask}
    onChange={(e) => setNewTask(e.target.value)}
    placeholder="Add a new task..."
    className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      newTask ? "text-black" : "text-gray-500"
    }`}
  />
  <button
    type="submit"
    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
  >
    Add Task
  </button>
</form>


        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 border-2 rounded-md checked:bg-blue-500 cursor-pointer"
              />
              <span className={`flex-1 ${task.completed ? 'line-through text-gray-500 ' : ''}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          © 2024 Task Manager. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

export default ToDo