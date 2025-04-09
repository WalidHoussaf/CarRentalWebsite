import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [dashboardData, setDashboardData] = useState({
    message: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || !isAdmin()) {
        setError('You do not have permission to access this page');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/admin/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, isAdmin]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !isAuthenticated || !isAdmin()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-black/80 backdrop-blur-lg p-8 rounded-lg shadow-lg border border-red-500/20 max-w-md w-full">
          <h2 className="text-red-500 text-2xl mb-4">Access Denied</h2>
          <p className="text-white mb-6">{error || 'You do not have permission to access this page'}</p>
          <Link 
            to="/" 
            className="block w-full text-center bg-gradient-to-r from-cyan-500 to-cyan-700 text-white py-2 rounded-md hover:from-cyan-600 hover:to-cyan-800 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-xl rounded-xl p-8 border border-cyan-800/20 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            {t('adminDashboard')}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Stats Cards */}
            <div className="bg-black/60 rounded-lg p-6 border border-cyan-900/30 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400 text-sm">{t('totalUsers')}</h3>
                <span className="p-2 bg-cyan-500/10 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl md:text-3xl font-semibold">248</p>
                <p className="text-green-400 text-sm mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  12% {t('thisMonth')}
                </p>
              </div>
            </div>
            
            <div className="bg-black/60 rounded-lg p-6 border border-cyan-900/30 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400 text-sm">{t('activeCars')}</h3>
                <span className="p-2 bg-cyan-500/10 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl md:text-3xl font-semibold">42</p>
                <p className="text-green-400 text-sm mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  5% {t('thisMonth')}
                </p>
              </div>
            </div>
            
            <div className="bg-black/60 rounded-lg p-6 border border-cyan-900/30 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400 text-sm">{t('totalBookings')}</h3>
                <span className="p-2 bg-cyan-500/10 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl md:text-3xl font-semibold">156</p>
                <p className="text-green-400 text-sm mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  18% {t('thisMonth')}
                </p>
              </div>
            </div>
            
            <div className="bg-black/60 rounded-lg p-6 border border-cyan-900/30 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400 text-sm">{t('revenue')}</h3>
                <span className="p-2 bg-cyan-500/10 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl md:text-3xl font-semibold">$24,380</p>
                <p className="text-green-400 text-sm mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  24% {t('thisMonth')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">{t('quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Link 
              to="/admin/cars/add" 
              className="bg-gradient-to-r from-cyan-900/20 to-black hover:from-cyan-800/30 hover:to-black/80 p-4 rounded-lg border border-cyan-900/30 flex items-center justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <span className="font-medium">{t('addNewCar')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
            
            <Link 
              to="/admin/users" 
              className="bg-gradient-to-r from-cyan-900/20 to-black hover:from-cyan-800/30 hover:to-black/80 p-4 rounded-lg border border-cyan-900/30 flex items-center justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <span className="font-medium">{t('manageUsers')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
            
            <Link 
              to="/admin/bookings" 
              className="bg-gradient-to-r from-cyan-900/20 to-black hover:from-cyan-800/30 hover:to-black/80 p-4 rounded-lg border border-cyan-900/30 flex items-center justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <span className="font-medium">{t('viewBookings')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </Link>
            
            <Link 
              to="/admin/reports" 
              className="bg-gradient-to-r from-cyan-900/20 to-black hover:from-cyan-800/30 hover:to-black/80 p-4 rounded-lg border border-cyan-900/30 flex items-center justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <span className="font-medium">{t('generateReports')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>
          </div>
          
          {/* API Response */}
          <div className="bg-black/40 rounded-lg p-6 border border-cyan-900/30">
            <h2 className="text-xl font-semibold text-cyan-300 mb-4">{t('apiResponse')}</h2>
            <pre className="bg-black/60 p-4 rounded-md overflow-x-auto text-green-400 font-mono text-sm">
              {JSON.stringify(dashboardData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 