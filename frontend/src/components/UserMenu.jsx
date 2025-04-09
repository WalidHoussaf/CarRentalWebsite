import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const UserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // If not authenticated, don't render the menu
  if (!isAuthenticated || !user) {
    return null;
  }

  // Direct check of user role
  const isUserAdmin = user.role === 'admin';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-cyan-900/20 transition-colors"
        aria-label="Open user menu"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-black font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-black border border-cyan-900/30 rounded-md shadow-lg py-1 z-50 backdrop-blur-lg">
          <div className="px-4 py-2 border-b border-cyan-900/30">
            <p className="text-sm text-white">{user.name}</p>
            <p className="text-xs text-cyan-400">{user.email}</p>
            <div className="mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isUserAdmin ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-500/20 text-gray-300'
              }`}>
                {isUserAdmin ? t('adminRole') : t('userRole')}
              </span>
            </div>
          </div>
            
          <div className="py-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-200 hover:bg-cyan-900/20 hover:text-white transition-colors"
            >
              {t('myProfile')}
            </Link>
            
            {/* Only show My Bookings for regular users, not for admins */}
            {!isUserAdmin && (
              <Link
                to="/bookings"
                className="block px-4 py-2 text-sm text-gray-200 hover:bg-cyan-900/20 hover:text-white transition-colors"
              >
                {t('myBookings')}
              </Link>
            )}
            
            {isUserAdmin && (
              <>
                <div className="border-t border-cyan-900/30 my-1"></div>
                <Link
                  to="/admin/dashboard"
                  className="block px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-900/20 hover:text-white transition-colors"
                >
                  {t('adminDashboard')}
                </Link>
                <Link
                  to="/admin/cars"
                  className="block px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-900/20 hover:text-white transition-colors"
                >
                  {t('manageCars')}
                </Link>
                <Link
                  to="/admin/bookings"
                  className="block px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-900/20 hover:text-white transition-colors"
                >
                  {t('manageBookings')}
                </Link>
                <Link
                  to="/admin/users"
                  className="block px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-900/20 hover:text-white transition-colors"
                >
                  {t('manageUsers')}
                </Link>
              </>
            )}
            
            <div className="border-t border-cyan-900/30 my-1"></div>
            
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
            >
              {t('signOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 