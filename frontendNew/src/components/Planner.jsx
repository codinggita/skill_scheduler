import React, { useState } from "react";
import { RiCalendarLine, RiDashboardLine, RiFileTextLine, RiMenuLine, RiMoonLine, RiSettings4Line, RiTodoLine } from "react-icons/ri";
import ToDo from "../pages/To-do";
import Study from "./Study.jsx";

const Planner = () => {
    const [activeTab, setActiveTab] = useState("To-Do List");
    const [menuItems, setMenuItems] = useState([
        { icon: RiTodoLine, text: 'To-Do List', active: true },
        { icon: RiCalendarLine, text: 'Planner', active: false },
        { icon: RiDashboardLine, text: 'Dashboard', active: false },
        { icon: RiFileTextLine, text: 'Notes', active: false },
    ]);

    const handleTabClick = (e) => {
        setActiveTab(e.target.textContent);
        setMenuItems(
            menuItems.map((item) =>
                item.text === e.target.textContent ? { ...item, active: true } : { ...item, active: false }
            )
        );
    }
    return (
        <div className="flex h-screen bg-white text-white">
            <div className="flex h-screen bg-blue-500 w-screen">
                {/* Sidebar */}
                <div className="w-64 bg-white flex flex-col border-r-2 border-gray-800 sticky top-0">
                    {/* Logo */}
                    <div className="p-6 border-gray-200">
                        <div className="flex items-center gap-2">
                            <div className="text-indigo-600 text-2xl font-bold">TaskOS</div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 p-4">
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                onClick={handleTabClick}
                                className={`flex hover:shadow-lg hover:border hover:border-gray-300 hover:inset-shadow hover:inset-shadow-black items-center gap-3 px-4 py-3 rounded-lg cursor-pointer mb-1
                ${item.active
                                        ? 'bg-black text-white shadow-lg shadow-black/20'
                                        : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <item.icon className="text-xl" />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </nav>
                </div>
                <div className="bg-yellow-500 h-full pt-[64px] w-full">
                    
                    {
                        (activeTab === "To-Do List") ? <ToDo /> : ""
                    }
                    {
                        (activeTab === "Planner") ? <Study /> : ""
                    }
                </div>

            </div>
                      
        </div>
    );
};

export default Planner;
