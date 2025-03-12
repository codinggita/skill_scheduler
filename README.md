# Skill Scheduler

Skill Scheduler is an interactive study planner designed to help students and professionals organize their learning schedules efficiently. It includes features such as progress tracking, goal setting, exam scheduling, and note management.

## Features
- **Progress Tracker**: Monitor study progress and completed tasks.
- **To-Do List**: Organize pending work and study tasks.
- **Exam Scheduler**: Add and manage upcoming exams.
- **Notes Management**: Store revision notes, quiz notes, and improvements.
- **Quizz Section** : Here there will be quiz generated according to the subject user choses to attend 
- **User Authentication**: Secure login and access control (without JWT & Mongoose).

## Tech Stack
- **Frontend**: React, Material UI, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (without Mongoose)
- **Hosting**: Render (backend)

## Project Links
- **Postman Documentation**: [View API Documentation](https://documenter.getpostman.com/view/39189818/2sAYX3sixA)
- **Deployed App**: [Skill Scheduler](https://skill-scheduler.onrender.com)
- **Figma Design**: [View UI Design](https://www.figma.com/design/1PDr2aGXQJMBxMr5OSgDRF/Skills-Schedular?node-id=0-1&t=3u6CpLX7JLfgtA9Q-1)
- **GitHub Repository**: [View Source Code](https://github.com/ishitatrivedi-dell/skill_scheduler)


## API Endpoints
### Dashboard
- **Progress Overview**: `GET /api/dashboard/progress`
- **Upcoming Exams**: `GET /api/dashboard/upcoming-exams`
- **Dashboard Data**: `GET /api/dashboard/dashboard`

### Planner
- **Fetch Pending Work**: `GET /api/planner/pending-work`
- **Add To-Do Task**: `POST /api/planner/to-do`
- **Fetch Exam Details**: `GET /api/planner/exams`
- **Add Exam Detail**: `POST /api/planner/exams`
- **Edit Exam Detail**: `PUT /api/planner/exams/:id`

## Contributing
Feel free to fork this repository, make improvements, and submit a pull request!

## License
This project is licensed under the MIT License.
