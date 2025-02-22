import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const NoteList = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Project Meeting Notes',
      content: 'Discussed new feature implementation timeline. Team agreed on MVP scope. Follow-up meeting scheduled for next week.',
      lastEdited: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ['Project', 'Meeting']
    },
    {
      id: 2,
      title: 'Research Findings',
      content: 'Key findings from user research interviews. Main pain points identified: onboarding process and dashboard navigation.',
      lastEdited: new Date(Date.now() - 24 * 60 * 60 * 1000),
      tags: ['Research', 'UX']
    }
  ]);

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 px-4">
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
          <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800">
            <span>New Note</span>
          </button>
        </div>

        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white p-6 rounded-lg shadow-sm mx-4">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{note.title}</h2>
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{note.content}</p>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {note.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-gray-100 text-sm text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  Last edited {formatDistanceToNow(note.lastEdited)} ago
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteList;