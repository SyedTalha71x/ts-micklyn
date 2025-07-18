import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiAward,
  FiList,
  FiUsers,
  FiActivity,
  FiBell,
  FiSettings,
  FiMenu
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
  { name: 'Rewards System', icon: FiAward, path: '/admin/rewards' },
  { name: 'Task Management', icon: FiList, path: '/admin/task-management' },
  { name: 'Leaderboard', icon: FiUsers, path: '/admin/leaderboard' },
  { name: 'User Activity', icon: FiActivity, path: '/admin/user-activity' },
  { name: 'Notifications', icon: FiBell, path: '/admin/notifications' },
  { name: 'Settings', icon: FiSettings, path: '/admin/profile-management' },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="md:hidden p-4">
        <button onClick={() => setIsOpen(!isOpen)}>
          <FiMenu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className="fixed md:static top-0 left-0 z-40 h-full w-64 bg-white shadow-lg md:shadow-none md:h-auto md:w-64"
          >
            <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                <img src='/Layer_1_black.svg' alt="Logo" className="w-7 h-7"/>
              <h1 className="text-xl font-bold text-gray-800">NomicsAI</h1>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-2 rounded-lg transition-colors text-sm font-medium ${
                          isActive
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                        }`
                      }
                      onClick={() => setIsOpen(false)} // close on mobile click
                    >
                      <item.icon className="text-lg" />
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
