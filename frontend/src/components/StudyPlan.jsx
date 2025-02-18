import React, { useState, useEffect } from 'react';
import '../styling/studyplanner.css';

const StudyPlanner = () => {
    const [studyPlans, setStudyPlans] = useState([]);
    const [newPlan, setNewPlan] = useState({ startDate: '', endDate: '', subject: '', important: '', tasks: '' });

    useEffect(() => {
        fetch('https://skill-scheduler.onrender.com/api/planner/study-plan')
            .then(response => response.json())
            .then(data => setStudyPlans(data))
            .catch(error => console.error('Error fetching study plans:', error));
    }, []);

    const handleChange = (e) => {
        setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
    };

    const addStudyPlan = () => {
        fetch('https://skill-scheduler.onrender.com/api/planner/study-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlan)
        })
            .then(response => response.json())
            .then(data => setStudyPlans([...studyPlans, data]))
            .catch(error => console.error('Error adding study plan:', error));
    };

    const deleteStudyPlan = (id) => {
        fetch(`https://skill-scheduler.onrender.com/api/planner/study-plan/${id}`, {
            method: 'DELETE',
        })
            .then(() => setStudyPlans(studyPlans.filter(plan => plan._id !== id)))
            .catch(error => console.error('Error deleting study plan:', error));
    };

    return (
        <div className="study-planner-container">
            <h2>Study Planner</h2>
            <div className="study-plan-form">
                <input type="date" name="startDate" placeholder="Start Date" onChange={handleChange} />
                <input type="date" name="endDate" placeholder="End Date" onChange={handleChange} />
                <input type="text" name="subject" placeholder="Subject" onChange={handleChange} />
                <input type="text" name="important" placeholder="Important" onChange={handleChange} />
                <input type="text" name="tasks" placeholder="Task List" onChange={handleChange} />
                <button onClick={addStudyPlan}>Add Plan</button>
            </div>
            <div className="study-plan-list">
                {studyPlans.map(plan => (
                    <div key={plan._id} className="study-plan-item">
                        <p><strong>Start Date:</strong> {plan.startDate}</p>
                        <p><strong>End Date:</strong> {plan.endDate}</p>
                        <p><strong>Subject:</strong> {plan.subject}</p>
                        <p><strong>Important:</strong> {plan.important}</p>
                        <p><strong>Tasks:</strong> {plan.tasks}</p>
                        <button onClick={() => deleteStudyPlan(plan._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudyPlanner;
