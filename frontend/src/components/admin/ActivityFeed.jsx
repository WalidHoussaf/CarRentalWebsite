import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

// Activity item component for individual feed entries
const ActivityItem = ({ activity }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  // Different icon based on activity type
  const getIcon = () => {
    switch (activity.type) {
      case 'booking':
        return (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-900/30 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-900/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'user':
        return (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-900/30 text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-900/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'car':
        return (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/30 to-green-900/30 text-green-400 border border-green-500/20 shadow-lg shadow-green-900/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
        );
      case 'payment':
        return (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-500/30 to-yellow-900/30 text-yellow-400 border border-yellow-500/20 shadow-lg shadow-yellow-900/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-900/30 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-900/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  // Get activity type color class
  const getActivityTypeColorClass = () => {
    switch (activity.type) {
      case 'booking': return 'text-cyan-400';
      case 'user': return 'text-purple-400';
      case 'car': return 'text-green-400';
      case 'payment': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  // Format the timestamp to a readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  // Generate a unique animation delay for staggered animations
  const animationDelay = `${Math.random() * 0.5}s`;

  return (
    <div 
      className="flex items-start space-x-4 p-3.5 mb-2 hover:bg-black/40 rounded-xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-cyan-900/30 group animate-fadeIn relative overflow-hidden"
      style={{ 
        animationDelay,
        animationFillMode: 'both' 
      }}
    >
      {/* Subtle background pulse effect on hover */}
      <div className="absolute inset-0 opacity-0 bg-gradient-to-r from-cyan-900/0 via-cyan-800/5 to-cyan-900/0 group-hover:opacity-100 transition-opacity duration-700 pulse-slow"></div>
      
      {/* Avatar or icon */}
      {getIcon()}
      
      {/* Activity content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium mb-1 group-hover:text-cyan-50 transition-colors duration-300">{activity.message}</p>
        <div className="flex items-center">
          <span className={`text-xs font-medium ${getActivityTypeColorClass()} uppercase mr-2 tracking-wider`}>
            {activity.type}
          </span>
          <p className="text-xs text-gray-400 flex items-center">
            <span className="font-medium">{activity.user}</span>
            <span className="mx-1.5 text-gray-500 text-[10px]">•</span>
            <span className="text-gray-500">{formatTime(activity.timestamp)}</span>
          </p>
        </div>
      </div>
      
      {/* Action button if needed */}
      {activity.actionable && (
        <button 
          className="text-xs py-1.5 px-3 bg-cyan-500/10 hover:bg-cyan-500/30 text-cyan-400 hover:text-cyan-300 rounded-lg transition-all duration-300 transform hover:scale-105 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-md hover:shadow-cyan-500/10 cursor-pointer"
        >
          {t('view') || 'View'}
        </button>
      )}
    </div>
  );
};

const ActivityFeed = ({ initialActivities = [] }) => {
  const { language } = useLanguage();
  const { authToken } = useAuth();
  const t = useTranslations(language);
  const [activities, setActivities] = useState(initialActivities);
  const [loading, setLoading] = useState(initialActivities.length === 0);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    // Always update activities state when initialActivities prop changes
    if (initialActivities.length > 0) {
      setActivities(initialActivities);
      setLoading(false);
      setError(null);
    }
  }, [initialActivities]);
  
  // Setup the fetch activities function
  const fetchActivities = async () => {
    // If there's no auth token, don't try to fetch
    if (!authToken) {
      console.warn('No auth token available for fetching activities');
      return;
    }
    
    try {
      setLoading(true);
      setRefreshing(true);
      
      const response = await axios.get('http://localhost:8000/api/admin/activities', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          limit: 10
        }
      });
      
      if (response.data.status === 'success') {
        setActivities(response.data.data);
        setError(null);
      } else {
        console.warn('Activity fetch returned non-success status:', response.data);
        // Don't set error if we already have activities to display
        if (activities.length === 0) {
          setError('Failed to fetch activities');
        }
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      // Don't set error if we already have activities to display
      if (activities.length === 0) {
        setError('Error fetching activities. Please try again later.');
      }
    } finally {
      setLoading(false);
      // Add a slight delay before turning off the refreshing indicator for UX
      setTimeout(() => setRefreshing(false), 500);
    }
  };
  
  // Setup the polling mechanism
  useEffect(() => {
    // If we have initial activities, wait 30 seconds before first refresh
    // This prevents immediate loading state when component first mounts
    const initialDelay = initialActivities.length > 0 ? 30000 : 0;
    
    // Set timeout for first fetch
    const timeoutId = setTimeout(() => {
      // Only fetch if we have an auth token
      if (authToken) {
        fetchActivities();
        
        // Setup interval for subsequent fetches
        const intervalId = setInterval(fetchActivities, 60000); // Every 60 seconds
        setRefreshInterval(intervalId);
      }
    }, initialDelay);
    
    // Clean up timeout and interval on component unmount
    return () => {
      clearTimeout(timeoutId);
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [authToken]); // Only re-run when authToken changes

  // Add CSS for custom animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.05; }
        50% { opacity: 0.2; }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }
      
      .pulse-slow {
        animation: pulse-slow 3s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="bg-black/60 rounded-xl p-4 border border-cyan-900/30 hover:border-cyan-500/30 transition-all duration-300 h-full backdrop-blur-sm shadow-xl relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-600/5 rounded-full blur-[50px]"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/5 rounded-full blur-[50px]"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 flex items-center">
            <div className="p-1.5 rounded-lg bg-cyan-900/20 text-cyan-400 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {t('recentActivity') || 'Recent Activity'}
          </h2>
          
          <div className="flex space-x-2">
            <div className="hidden sm:flex items-center space-x-1 mr-2">
              <span className={`h-2 w-2 rounded-full ${refreshing ? 'bg-cyan-400 animate-pulse' : 'bg-cyan-900'} transition-colors duration-300`}></span>
              <span className="text-xs text-gray-400">{t('live') || 'Live'}</span>
            </div>
            
            <button 
              onClick={() => fetchActivities()}
              className="text-xs flex items-center space-x-1 py-1 px-2 bg-cyan-900/20 hover:bg-cyan-900/40 text-cyan-400 rounded-lg transition-colors duration-200 border border-cyan-900/20 hover:border-cyan-500/30 cursor-pointer"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{refreshing ? t('refreshing') || 'Refreshing...' : t('refresh') || 'Refresh'}</span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col min-h-[450px]">
          <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-black/20 pb-2">
            {loading && activities.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="w-10 h-10 relative">
                  <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-cyan-500 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-cyan-300/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <p className="text-cyan-400 mt-3 text-sm">{t('loadingActivities') || 'Loading activities...'}</p>
              </div>
            ) : error && activities.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="bg-black/40 rounded-xl p-5 border border-red-900/30 max-w-xs mx-auto">
                  <div className="text-red-400 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mb-3">{error}</p>
                    <button 
                      onClick={() => fetchActivities()}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-all border border-red-500/20 hover:border-red-400/40 cursor-pointer"
                    >
                      {t('retry') || 'Retry'}
                    </button>
                  </div>
                </div>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-center">
                <div className="bg-black/40 rounded-xl p-5 border border-cyan-900/30 max-w-xs mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-cyan-900/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-400">{t('noActivitiesFound') || 'No recent activities found'}</p>
                  <p className="text-gray-500 text-sm mt-1">{t('checkBackSoon') || 'Check back soon for updates'}</p>
                </div>
              </div>
            ) : (
              activities.map((activity, index) => (
                <ActivityItem key={`${activity.id}-${index}`} activity={activity} />
              ))
            )}
          </div>
          
          {/* Footer area with activity count */}
          {activities.length > 0 && (
            <div className="pt-3 mt-2 border-t border-cyan-900/20 flex justify-between items-center text-xs text-gray-500">
              <span>
                {activities.length} {activities.length === 1 ? t('activity') || 'activity' : t('activities') || 'activities'} {refreshing ? t('updating') || 'updating...' : t('loaded') || 'loaded'}
              </span>
              
              <span className="text-cyan-900">
                {new Date().toLocaleDateString(language)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed; 