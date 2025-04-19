import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Clock } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className={`fixed w-full top-0 z-50 ${isDark ? 'bg-black text-white' : 'bg-white text-black'} shadow-md transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Clock className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">Skill Scheduler</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="hover:text-gray-500 transition-colors duration-200">Dashboard</Link>
            <Link to="/notes" className="hover:text-gray-500 transition-colors duration-200">Notes</Link>
            <Link to="/planner" className="hover:text-gray-500 transition-colors duration-200">Planner</Link>
            <Link to="/quiz" className="hover:text-gray-500 transition-colors duration-200">Quiz</Link>
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-md ${
                isDark 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              } transition-colors duration-200`}
            >
              {isDark ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
