import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { BsGraphUp, BsExclamationCircle, BsListCheck } from 'react-icons/bs';

const performanceData = [
  { week: 'Week 1', score: 65 },
  { week: 'Week 2', score: 70 },
  { week: 'Week 3', score: 68 },
  { week: 'Week 4', score: 72 },
  { week: 'Week 5', score: 71 },
  { week: 'Week 6', score: 75 }
];

const weakSubjects = [
  { subject: 'Mathematics', score: '65%' },
  { subject: 'Physics', score: '70%' }
];

const lowScoringQuizzes = [
  { name: 'Calculus Quiz 3', score: '62%' },
  { name: 'Mechanics Test 2', score: '68%' }
];

const recommendations = [
  'Schedule dedicated study blocks for challenging subjects',
  'Use practice tests to identify knowledge gaps',
  'Join study groups for collaborative learning'
];

function Imp() {
  return (
    <div className="flex bg-gray-100 w-screen h-[calc(100vh-64px)] mt-[64px]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-2 mb-6">
          <BsGraphUp className="text-2xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Improvement Insights</h1>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weak Subjects */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BsExclamationCircle className="text-red-500" />
              <h2 className="text-lg font-semibold">Weak Subjects</h2>
            </div>
            <div className="space-y-4">
              {weakSubjects.map((subject, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{subject.subject}</span>
                  <span className="text-red-500 font-medium">{subject.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low-Scoring Quizzes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BsListCheck className="text-orange-500" />
              <h2 className="text-lg font-semibold">Low-Scoring Quizzes</h2>
            </div>
            <div className="space-y-4">
              {lowScoringQuizzes.map((quiz, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{quiz.name}</span>
                  <span className="text-orange-500 font-medium">{quiz.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Study Habits Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Study Habits Analysis</h2>
          <p className="text-gray-600 mb-6">
            Based on your study patterns, we've noticed that you tend to study more effectively in the morning hours. However, your
            study sessions are often interrupted, which may affect your learning retention. We recommend establishing more
            consistent study blocks and minimizing distractions during these periods.
          </p>

          <h3 className="font-medium text-gray-900 mb-3">Recommendations</h3>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center text-sm text-gray-500">
          © 2024 Learning Analytics. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default  Imp ;