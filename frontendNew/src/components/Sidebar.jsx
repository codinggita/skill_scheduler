import { useState } from 'react';
import { RiTodoLine, RiCalendarLine, RiDashboardLine, RiFileTextLine, RiSettings4Line, RiMoonLine, RiMenuLine } from 'react-icons/ri';

function Sidebar() {
  const [userName] = useState('John');
  
  const menuItems = [
    { icon: RiTodoLine, text: 'To-Do List', active: true },
    { icon: RiCalendarLine, text: 'Planner' },
    { icon: RiDashboardLine, text: 'Dashboard' },
    { icon: RiFileTextLine, text: 'Notes' },
    { icon: RiSettings4Line, text: 'Settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="text-indigo-600 text-2xl font-bold">TaskOS</div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer mb-1
                ${item.active 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <item.icon className="text-xl" />
              <span>{item.text}</span>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <RiMoonLine className="text-gray-600 text-xl cursor-pointer" />
            <RiMenuLine className="text-gray-600 text-xl cursor-pointer" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium">{userName[0]}</span>
            </div>
            <div>
              <div className="text-sm font-medium">{userName} Doe</div>
              <div className="text-xs text-gray-500">Online</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;