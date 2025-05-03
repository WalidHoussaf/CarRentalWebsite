import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';
import ActivityFeed from '../../components/admin/ActivityFeed';
import PredictiveAnalytics from '../../components/admin/PredictiveAnalytics';
import WeatherWidget from '../../components/admin/WeatherWidget';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [dashboardData, setDashboardData] = useState({
    message: '',
    status: '',
    data: {
      usersCount: 0,
      activeCarsCount: 0,
      totalBookingsCount: 0,
      revenue: 0,
      recentActivities: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || !isAdmin()) {
        setError(t('noAccessPermission'));
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching dashboard data, authentication status:', { 
          isAuthenticated, 
          isAdmin: isAdmin(),
          token: localStorage.getItem('auth_token')?.substring(0, 10) + '...'
        });
        
        const response = await fetch('http://localhost:8000/api/admin/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        console.log('Dashboard API response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Dashboard data received:', data);
        setDashboardData(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setError(error.message || t('dashboardLoadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, isAdmin]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !isAuthenticated || !isAdmin()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black font-['Orbitron']">
        <div className="bg-black/80 backdrop-blur-lg p-8 rounded-lg shadow-lg border border-red-500/20 max-w-md w-full">
          <h2 className="text-red-500 text-2xl mb-4 font-semibold">{t('accessDenied')}</h2>
          <p className="text-white mb-6">{error || t('noAccessPermission')}</p>
          <Link 
            to="/" 
            className="block w-full text-center bg-gradient-to-r from-cyan-500 to-cyan-700 text-white py-2 rounded-md hover:from-cyan-600 hover:to-cyan-800 transition-all duration-300"
          >
            {t('backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  // Extract dashboard stats from the API response
  const { usersCount = 0, activeCarsCount = 0, totalBookingsCount = 0, revenue = 0 } = dashboardData.data || {};

  // Sample data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Last 6 months
  const last6Months = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
  if (last6Months.length < 6) {
    last6Months.unshift(...months.slice(-(6 - last6Months.length)));
  }

  // Revenue chart data
  const revenueData = {
    labels: last6Months,
    datasets: [
      {
        label: t('revenueTrend'),
        data: [8400, 10200, 9600, 12800, 16300, typeof revenue === 'number' ? revenue : parseFloat(revenue || 0)],
        borderColor: 'rgba(34, 211, 238, 1)', // Cyan color
        backgroundColor: function() {
          const ctx = document.createElement('canvas').getContext('2d');
          const gradient = ctx.createLinearGradient(0, 0, 0, 350);
          gradient.addColorStop(0, 'rgba(34, 211, 238, 0.5)');
          gradient.addColorStop(0.6, 'rgba(34, 211, 238, 0.15)');
          gradient.addColorStop(1, 'rgba(34, 211, 238, 0.01)');
          return gradient;
        },
        borderWidth: 2,
        pointBackgroundColor: 'rgba(34, 211, 238, 1)',
        pointBorderColor: 'rgba(0, 0, 0, 0.2)',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(34, 211, 238, 1)',
        pointHoverBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Bookings chart data
  const bookingsData = {
    labels: last6Months,
    datasets: [
      {
        label: t('bookingsTrend'),
        data: [42, 56, 63, 87, 112, totalBookingsCount],
        backgroundColor: function() {
          const ctx = document.createElement('canvas').getContext('2d');
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(34, 211, 238, 0.8)');
          gradient.addColorStop(1, 'rgba(34, 211, 238, 0.2)');
          return gradient;
        },
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(34, 211, 238, 0.3)',
        hoverBackgroundColor: 'rgba(34, 211, 238, 1)',
        hoverBorderColor: 'rgba(255, 255, 255, 0.5)',
        barThickness: 'flex',
        maxBarThickness: 40,
      },
    ],
  };

  // Car categories data
  const categoryData = {
    labels: ['SUV', 'Luxury', 'Sports', 'Compact', 'Midsize', 'Economy'],
    datasets: [
      {
        label: t('popularCategories'),
        data: [35, 25, 15, 10, 10, 5],
        backgroundColor: [
          'rgba(34, 211, 238, 0.8)',  // Cyan
          'rgba(16, 185, 129, 0.8)',  // Green
          'rgba(245, 158, 11, 0.8)',  // Amber
          'rgba(139, 92, 246, 0.8)',  // Purple
          'rgba(239, 68, 68, 0.8)',   // Red
          'rgba(59, 130, 246, 0.8)',  // Blue
        ],
        borderColor: [
          'rgba(34, 211, 238, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(34, 211, 238, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        hoverBorderColor: 'rgba(255, 255, 255, 1)',
        hoverBorderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  // Status indicators
  const statuses = [
    { name: t('onlineStatus'), status: t('online') },
    { name: t('serverStatus'), status: t('online') },
    { name: t('databaseStatus'), status: t('online') },
  ];

  // Chart options with responsive design and styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: 'white',
          font: {
            family: 'Orbitron, sans-serif',
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(34, 211, 238, 1)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(34, 211, 238, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxPadding: 5,
        usePointStyle: true,
        bodyFont: {
          family: 'Orbitron, sans-serif',
          size: 12,
        },
        titleFont: {
          family: 'Orbitron, sans-serif',
          weight: 'bold',
          size: 14,
        },
        callbacks: {
          labelTextColor: function() {
            return 'rgba(255, 255, 255, 0.9)';
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
          drawTicks: false,
          lineWidth: 1
        },
        border: {
          display: false,
        },
        ticks: { 
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 10,
          font: {
            family: 'Orbitron, sans-serif',
            size: 10,
          },
          callback: function(value) {
            // Format the y-axis ticks to include $ for revenue chart
            return value;
          }
        },
      },
      x: {
        grid: { 
          color: 'rgba(255, 255, 255, 0.05)',
          display: false,
        },
        border: {
          display: false,
        },
        ticks: { 
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 5,
          font: {
            family: 'Orbitron, sans-serif',
            size: 10,
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
      },
      y: {
        duration: 1000,
        from: 500,
      }
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
  };
  
  const revenueChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          color: 'white',
          font: {
            family: 'Orbitron, sans-serif',
            size: 10,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(34, 211, 238, 1)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(34, 211, 238, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        bodyFont: {
          family: 'Orbitron, sans-serif',
          size: 11,
        },
        titleFont: {
          family: 'Orbitron, sans-serif',
          weight: 'bold',
          size: 13,
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000
    },
  };

  return (
    <div className="bg-black text-white min-h-screen pt-20 pb-12 px-4 font-['Orbitron'] relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/5 to-black pointer-events-none"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10 z-0 bg-[url('/patterns/grid-pattern.svg')] bg-center"></div>
      
      {/* Glow effects */}
      <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-xl rounded-xl p-8 border border-cyan-800/20 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
              {t('dashboardOverview')}
            </h1>
            <div className="text-xs text-gray-400">
              {t('lastUpdated')}: {lastUpdated.toLocaleString()}
            </div>
          </div>
          
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
                <p className="text-2xl md:text-3xl font-semibold">{usersCount}</p>
                <p className="text-cyan-400 text-sm mt-1 flex items-center">
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
                <p className="text-2xl md:text-3xl font-semibold">{activeCarsCount}</p>
                <p className="text-cyan-400 text-sm mt-1 flex items-center">
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
                <p className="text-2xl md:text-3xl font-semibold">{totalBookingsCount}</p>
                <p className="text-cyan-400 text-sm mt-1 flex items-center">
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
                <p className="text-2xl md:text-3xl font-semibold">${typeof revenue === 'number' ? revenue.toFixed(2) : parseFloat(revenue || 0).toFixed(2)}</p>
                <p className="text-cyan-400 text-sm mt-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  24% {t('thisMonth')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Data Visualization Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Revenue Chart */}
            <div className="bg-gradient-to-b from-black/70 to-black/60 rounded-lg p-6 border border-cyan-900/30 shadow-lg hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/5 to-blue-900/5 rounded-lg"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/70 to-blue-500/50"></div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4 relative z-10">{t('monthlyRevenue')}</h2>
              <div className="relative z-10 h-80">
                <Line data={revenueData} options={revenueChartOptions} />
              </div>
            </div>
            
            {/* Bookings Chart */}
            <div className="bg-gradient-to-b from-black/70 to-black/60 rounded-lg p-6 border border-cyan-900/30 shadow-lg hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-cyan-900/5 rounded-lg"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 to-cyan-500/70"></div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4 relative z-10">{t('bookingStatistics')}</h2>
              <div className="relative z-10 h-80">
                <Bar data={bookingsData} options={chartOptions} />
              </div>
            </div>
          </div>
          
          {/* Additional Dashboard Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Recent Activity */}
            <div className="h-full">
              <ActivityFeed initialActivities={dashboardData.data.recentActivities || []} />
            </div>
            
            {/* Quick Actions and System Status */}
            <div className="grid grid-cols-1 gap-8">
              {/* System Status */}
              <div className="bg-black/60 rounded-lg p-6 border border-cyan-900/30 shadow-lg hover:border-cyan-500/30 transition-all duration-300">
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4">{t('systemStatus')}</h2>
                <div className="space-y-4">
                  {statuses.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-gray-300">{item.name}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
                        {item.status === t('online') ? t('online') : t('offline')}
                      </span>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">{t('activeUsers')}</span>
                      <span className="text-xl font-semibold text-cyan-400">
                        {Math.floor(usersCount * 0.6)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-black/60 rounded-lg p-6 border border-cyan-900/30 shadow-lg hover:border-cyan-500/30 transition-all duration-300">
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4">{t('quickActions')}</h2>
                <div className="space-y-3">
                  <Link 
                    to="/admin/cars" 
                    className="bg-gradient-to-r from-cyan-900/20 to-black hover:from-cyan-800/30 hover:to-black/80 p-4 rounded-lg border border-cyan-900/30 flex items-center justify-between transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="font-medium">{t('manageCars')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
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
                </div>
              </div>
            </div>
          </div>
          
          {/* Advanced Analytics Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-6">{t('advancedAnalytics')}</h2>
            <div className="bg-black/60 rounded-lg p-6 border border-cyan-900/30 shadow-lg hover:border-cyan-500/30 transition-all duration-300">
              <PredictiveAnalytics />
            </div>
          </div>
          
          {/* Car Category and Weather Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Popular Car Categories */}
            <div className="bg-gradient-to-b from-black/70 to-black/60 rounded-lg p-6 border border-cyan-900/30 shadow-lg hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/5 via-purple-900/5 to-blue-900/5 rounded-lg"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/50 via-purple-500/30 to-blue-500/50"></div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4 relative z-10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                {t('popularCategories')}
              </h2>
              <div className="relative z-10 flex justify-center items-center h-80">
                <div className="w-full max-w-md h-full py-2">
                  <Doughnut data={categoryData} options={doughnutOptions} />
                </div>
              </div>
              <div className="relative z-10 flex flex-wrap justify-center gap-2 mt-2">
                {categoryData.labels.map((label, index) => (
                  <div key={label} className="flex items-center px-2 py-1 bg-black/40 rounded-full border border-cyan-900/30">
                    <div className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: categoryData.datasets[0].backgroundColor[index] }}></div>
                    <span className="text-xs font-medium text-white">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reports Link */}
            <div className="bg-gradient-to-b from-black/70 to-black/60 rounded-lg p-6 border border-cyan-900/30 shadow-lg hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-cyan-900/5 via-blue-900/5 to-cyan-900/5 rounded-lg"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-cyan-500/70 to-blue-500/50"></div>
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4 relative z-10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('reports')}
              </h2>
              <div className="h-80 flex flex-col justify-center relative z-10">
                <Link 
                  to="/admin/reports" 
                  className="group bg-gradient-to-r from-cyan-500/10 to-cyan-900/20 hover:from-cyan-500/20 hover:to-cyan-900/40 p-6 rounded-lg border border-cyan-500/30 flex items-center justify-center flex-col gap-4 transition-all duration-300 hover:-translate-y-2 mb-6 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>
                  
                  <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-xl text-center text-white group-hover:text-cyan-200 transition-colors duration-300 relative">{t('generateReports')}</span>
                </Link>
                <div className="space-y-3">
                  <div className="flex items-center bg-black/30 p-2.5 rounded-lg border border-cyan-900/30">
                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{t('bookingReports')}</h3>
                      <p className="text-xs text-gray-400">{t('analyzeBookingTrends')}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-black/30 p-2.5 rounded-lg border border-cyan-900/30">
                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{t('revenueReports')}</h3>
                      <p className="text-xs text-gray-400">{t('trackFinancialPerformance')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Weather Widget with Map Visualization underneath */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-6">{t('weatherInfo')}</h2>
            <div className="bg-black/60 rounded-lg p-6 border border-cyan-900/30 shadow-lg hover:border-cyan-500/30 transition-all duration-300">
              <WeatherWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
