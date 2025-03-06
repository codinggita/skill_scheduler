## Overview
The Skill Scheduler is a MERN-based (MongoDB, Express.js, React, Node.js) study planner and progress tracker designed to help students and professionals manage tasks, schedule exams, track progress, and take notes in an organized way. The system provides a structured way to plan studies, set learning goals, and analyze progress without distractions.

## Features and Functionalities

### 1. Dashboard
- Provides an overview of study progress.
- Displays upcoming exams and pending tasks.
- Shows graphical analysis of completed vs. pending work.

#### API Endpoints for Dashboard
- **Progress Overview** → `/api/dashboard/progress`
- **Upcoming Exams** → `/api/dashboard/upcoming-exams`
- **Dashboard Data** → `/api/dashboard/dashboard`

### 2. Study Planner
The planner section is the core part of the Skill Scheduler, helping users manage study schedules and tasks.

#### a. To-Do List (Pending Work)
- Users can add, update, delete, and view tasks.
- Helps track pending assignments, projects, or topics to study.

#### API Endpoints for To-Do List
- Fetch pending tasks → `/api/planner/pending-work`
- Add a task → `/api/planner/to-do`

#### b. Exam Planner
- Users can add, edit, and view exam schedules.
- Each exam entry includes subject name, exam date, and important topics.

#### API Endpoints for Exam Planner
- Fetch exams → `/api/planner/exams`
- Add a new exam → `/api/planner/exams`
- Edit an exam → `/api/planner/exams/:id`

### 3. Notes Management
- Helps in organizing different types of notes:
  - Yesterday's Notes
  - Revision Notes
  - Quiz Notes
  - Improvements
- All notes are stored in the "notes" collection in MongoDB.

### 4. Quiz Generator (Computer Science Only)
- Users can generate quizzes related to computer science topics to test their knowledge.
- Helps in self-assessment before exams.

### 5. Authentication (Without JWT & Mongoose)
- User authentication system without using JWT and Mongoose.
- Secure login and signup options.

## Tech Stack
- **Frontend**: React.js (Styled using CSS instead of Tailwind CSS)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Without Mongoose)
- **UI Components**: Material UI (MUI)

## Project Goal
The Skill Scheduler aims to provide an efficient study management system where students can schedule, track, and improve their learning. It acts as a personalized digital planner for academic success.

## Key Features of Skill Scheduler
✅ **Dashboard Overview** – Displays progress tracking, upcoming exams, and pending tasks at a glance.

✅ **To-Do List (Pending Work)** – Allows users to add, update, and track study tasks and assignments.

✅ **Exam Planner** – Helps schedule and manage exam dates, subjects, and important topics.

✅ **Notes Management** – Organizes different types of study notes (Yesterday’s Notes, Revision Notes, Quiz Notes, and Improvements).

✅ **Quiz Generator** – Generates quizzes related to computer science for self-assessment.

✅ **Progress Tracking** – Provides insights into completed vs. pending work with data visualization.

✅ **User Authentication** – Secure login/signup system (without JWT & Mongoose).

✅ **Material UI Design** – Clean and modern UI using Material UI (MUI).

✅ **MongoDB Database (Without Mongoose)** – Stores tasks, exams, and notes efficiently.

## Project Resources
- **Postman Documentation**: [View API Documentation](https://documenter.getpostman.com/view/39189818/2sAYX3sixA)
- **Deployed Application**: [Skill Scheduler Live](https://skill-scheduler.onrender.com)
- **Figma Design**: [View UI Design](https://www.figma.com/design/1PDr2aGXQJMBxMr5OSgDRF/Skills-Schedular?node-id=0-1&t=3u6CpLX7JLfgtA9Q-1)
- **GitHub Repository**: [Source Code](https://github.com/ishitatrivedi-dell/skill_scheduler)
