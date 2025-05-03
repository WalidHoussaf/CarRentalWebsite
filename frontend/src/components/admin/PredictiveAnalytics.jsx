import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Fallback demo data in case API fails
const demoData = {
  bookingPredictions: Array(14).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      day_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()],
      predicted_bookings: Math.floor(Math.random() * 15) + 5,
      confidence_interval: {
        low: Math.floor(Math.random() * 5) + 2,
        high: Math.floor(Math.random() * 10) + 15
      },
      is_weekend: date.getDay() === 0 || date.getDay() === 6
    };
  }),
  revenueForecasts: Array(14).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const baseRevenue = Math.floor(Math.random() * 2000) + 1000;
    return {
      date: date.toISOString().split('T')[0],
      day_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()],
      predicted_revenue: baseRevenue,
      confidence_interval: {
        low: baseRevenue - Math.floor(Math.random() * 300),
        high: baseRevenue + Math.floor(Math.random() * 500)
      },
      is_weekend: date.getDay() === 0 || date.getDay() === 6
    };
  }),
  pricingRecommendations: {
    SUV: {
      category: 'SUV',
      current_avg_price: 75.50,
      high_demand_days: {
        dates: Array(5).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i + 2);
          return date.toISOString().split('T')[0];
        }),
        recommendation: 'Increase prices by 15-20%',
        suggested_price: 86.83
      },
      low_demand_days: {
        dates: Array(3).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i + 10);
          return date.toISOString().split('T')[0];
        }),
        recommendation: 'Offer 10-15% discount',
        suggested_price: 67.95
      }
    },
    Luxury: {
      category: 'Luxury',
      current_avg_price: 120.00,
      high_demand_days: {
        dates: Array(4).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i + 5);
          return date.toISOString().split('T')[0];
        }),
        recommendation: 'Increase prices by 15-20%',
        suggested_price: 138.00
      },
      low_demand_days: {
        dates: Array(4).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i + 15);
          return date.toISOString().split('T')[0];
        }),
        recommendation: 'Offer 10-15% discount',
        suggested_price: 108.00
      }
    }
  }
};

const PredictiveAnalytics = () => {
  const { language } = useLanguage();
  const { authToken } = useAuth();
  const t = useTranslations(language);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayType, setDisplayType] = useState('bookings'); // bookings, revenue, pricing
  const [hoveredRecommendation, setHoveredRecommendation] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [useFallbackData, setUseFallbackData] = useState(false);

  // Use fallback data when API data isn't usable and user has clicked the "Use Demo Data" button
  const effectivePredictionData = useFallbackData ? demoData : predictionData;

  // Fetch prediction data from the API
  const fetchPredictionData = async (retry = false) => {
    // Use demo data button has been pressed
    if (useFallbackData) {
      setPredictionData(demoData);
      setLoading(false);
      setError(null);
      return;
    }

    // Check if we have an auth token
    const token = localStorage.getItem('auth_token') || authToken;
    if (!token) {
      console.error('No authentication token available');
      setError('Authentication error. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching predictions data with token: ${token.substring(0, 10)}... (Attempt: ${retryCount + 1})`);
      
      const response = await axios.get('http://localhost:8000/api/admin/predictions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // Add timeout to prevent infinite loading
        timeout: 15000
      });

      console.log('Prediction API response:', response);

      // Add detailed logging of the response structure to diagnose the issue
      console.log('Response data structure:', {
        hasData: !!response.data,
        status: response.data?.status,
        hasBookingPredictions: !!response.data?.data?.bookingPredictions,
        hasRevenueForecasts: !!response.data?.data?.revenueForecasts,
        hasPricingRecommendations: !!response.data?.data?.pricingRecommendations
      });

      // Fix: Check if the response has data regardless of status property
      if (response.data && response.data.data) {
        console.log("Setting prediction data:", response.data.data);
        setPredictionData(response.data.data);
        setError(null);
        setRetryCount(0); // Reset retry count on success
        setLoading(false); // Ensure loading is set to false here
      } else if (response.data && response.data.status === 'success') {
        // Alternative success path if the data isn't in the expected structure
        console.log("Setting prediction data (alt path):", response.data);
        setPredictionData(response.data);
        setError(null);
        setRetryCount(0);
        setLoading(false);
      } else {
        console.warn('Prediction data fetch returned non-success status or invalid structure:', response.data);
        setError(`Failed to fetch prediction data: ${response.data?.message || 'Invalid data structure'}`);
        setLoading(false);
        
        // Auto-retry on server error
        if (retry && retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount(retryCount + 1);
            fetchPredictionData(true);
          }, 3000); // Wait 3 seconds before retrying
        }
      }
    } catch (err) {
      console.error('Error fetching prediction data:', err);
      // More detailed error message
      const errorMessage = err.response 
        ? `Error (${err.response.status}): ${err.response.data?.message || err.message}` 
        : `Network error: ${err.message}`;
      setError(errorMessage);
      setLoading(false);
      
      // Auto-retry on network errors or server errors (5xx)
      if (retry && retryCount < maxRetries && 
         (!err.response || (err.response && err.response.status >= 500))) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchPredictionData(true);
        }, 3000); // Wait 3 seconds before retrying
      }
    }
  };

  useEffect(() => {
    // Reset to API data when dependencies change
    setUseFallbackData(false);
    fetchPredictionData(true); // Enable auto-retry on initial load
  }, [authToken]);

  // Prepare chart data for bookings
  const prepareBookingChartData = () => {
    console.log("Preparing booking chart data with:", effectivePredictionData);
    
    // Handle both possible data structures
    const bookingPredictions = effectivePredictionData?.bookingPredictions || 
                              (effectivePredictionData && Array.isArray(effectivePredictionData) ? effectivePredictionData : null);
                              
    if (!bookingPredictions) {
      console.warn("No valid booking predictions found in:", effectivePredictionData);
      return null;
    }

    // Extract the next 14 days for more readable charts
    const predictions = bookingPredictions.slice(0, 14);
    
    const labels = predictions.map(p => {
      const date = new Date(p.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    
    return {
      labels,
      datasets: [
        {
          label: t('predictedBookings') || 'Predicted Bookings',
          data: predictions.map(p => p.predicted_bookings),
          borderColor: 'rgba(34, 211, 238, 1)', // Cyan color
          backgroundColor: 'rgba(34, 211, 238, 0.1)',
          tension: 0.4,
          fill: false,
        },
        {
          label: t('confidenceLower') || 'Lower Bound',
          data: predictions.map(p => p.confidence_interval.low),
          borderColor: 'rgba(34, 211, 238, 0.3)',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
          fill: false,
          pointRadius: 0,
        },
        {
          label: t('confidenceUpper') || 'Upper Bound',
          data: predictions.map(p => p.confidence_interval.high),
          borderColor: 'rgba(34, 211, 238, 0.3)',
          backgroundColor: 'rgba(34, 211, 238, 0.05)',
          borderDash: [5, 5],
          tension: 0.4,
          fill: '-1', // Fill between this dataset and the previous one
          pointRadius: 0,
        }
      ]
    };
  };

  // Prepare chart data for revenue
  const prepareRevenueChartData = () => {
    console.log("Preparing revenue chart data with:", effectivePredictionData);
    
    // Handle both possible data structures
    const revenueForecasts = effectivePredictionData?.revenueForecasts || 
                           (effectivePredictionData && effectivePredictionData.revenue ? effectivePredictionData.revenue : null);
                           
    if (!revenueForecasts) {
      console.warn("No valid revenue forecasts found in:", effectivePredictionData);
      return null;
    }

    // Extract the next 14 days for more readable charts
    const forecasts = revenueForecasts.slice(0, 14);
    
    const labels = forecasts.map(p => {
      const date = new Date(p.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    
    return {
      labels,
      datasets: [
        {
          label: t('predictedRevenue') || 'Predicted Revenue',
          data: forecasts.map(p => p.predicted_revenue),
          borderColor: 'rgba(16, 185, 129, 1)', // Green color
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: false,
        },
        {
          label: t('confidenceLower') || 'Lower Bound',
          data: forecasts.map(p => p.confidence_interval.low),
          borderColor: 'rgba(16, 185, 129, 0.3)',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
          fill: false,
          pointRadius: 0,
        },
        {
          label: t('confidenceUpper') || 'Upper Bound',
          data: forecasts.map(p => p.confidence_interval.high),
          borderColor: 'rgba(16, 185, 129, 0.3)',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          borderDash: [5, 5],
          tension: 0.4,
          fill: '-1', // Fill between this dataset and the previous one
          pointRadius: 0,
        }
      ]
    };
  };

  // Chart options with responsive design and styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            family: 'Orbitron, sans-serif',
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        bodyFont: {
          family: 'Orbitron, sans-serif',
        },
        titleFont: {
          family: 'Orbitron, sans-serif',
        },
        callbacks: {
          label: function(context) {
            if (displayType === 'revenue') {
              return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
            }
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'Orbitron, sans-serif',
          },
          callback: function(value) {
            if (displayType === 'revenue') {
              return '$' + value;
            }
            return value;
          }
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { 
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'Orbitron, sans-serif',
          },
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  // Render pricing recommendations
  const renderPricingRecommendations = () => {
    console.log("Rendering pricing recommendations with:", effectivePredictionData);
    
    // Handle both possible data structures
    const pricingRecommendations = effectivePredictionData?.pricingRecommendations || 
                                 (effectivePredictionData && effectivePredictionData.pricing ? effectivePredictionData.pricing : null);
    
    if (!pricingRecommendations) {
      console.warn("No valid pricing recommendations found in:", effectivePredictionData);
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">{t('noPricingData') || 'No pricing data available'}</p>
        </div>
      );
    }

    const categories = Object.values(pricingRecommendations);
    
    return (
      <div className="space-y-6 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-black/20">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="bg-black/40 rounded-lg p-4 border border-cyan-900/30 hover:border-cyan-500/30 transition-all duration-300"
          >
            <h3 className="text-lg font-medium text-cyan-400 mb-2">{category.category}</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400">{t('currentAvgPrice') || 'Current Avg. Price'}:</span>
              <span className="text-white font-medium">${category.current_avg_price}</span>
            </div>
            
            <div className="space-y-4">
              {/* High demand days */}
              <div 
                className="bg-gradient-to-r from-black to-green-900/10 p-3 rounded border border-green-500/20 relative"
                onMouseEnter={() => setHoveredRecommendation('high-' + category.category)}
                onMouseLeave={() => setHoveredRecommendation(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-green-400 font-medium">{t('highDemandDays') || 'High Demand Days'}</h4>
                  <span className="text-white font-bold">${category.high_demand_days.suggested_price}</span>
                </div>
                <p className="text-gray-400 text-sm">{category.high_demand_days.recommendation}</p>
                
                {/* Hover tooltip for dates */}
                {hoveredRecommendation === 'high-' + category.category && category.high_demand_days.dates.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-black/90 border border-green-500/30 rounded p-2 z-10 text-sm">
                    <h5 className="text-green-400 mb-1">{t('highDemandDates') || 'High Demand Dates'}:</h5>
                    <div className="flex flex-wrap gap-1">
                      {category.high_demand_days.dates.slice(0, 5).map((date, i) => (
                        <span key={i} className="bg-black/60 px-2 py-1 rounded text-white text-xs">{date}</span>
                      ))}
                      {category.high_demand_days.dates.length > 5 && (
                        <span className="bg-black/60 px-2 py-1 rounded text-white text-xs">
                          +{category.high_demand_days.dates.length - 5} {t('moreDates') || 'more'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Low demand days */}
              <div 
                className="bg-gradient-to-r from-black to-yellow-900/10 p-3 rounded border border-yellow-500/20 relative"
                onMouseEnter={() => setHoveredRecommendation('low-' + category.category)}
                onMouseLeave={() => setHoveredRecommendation(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-yellow-400 font-medium">{t('lowDemandDays') || 'Low Demand Days'}</h4>
                  <span className="text-white font-bold">${category.low_demand_days.suggested_price}</span>
                </div>
                <p className="text-gray-400 text-sm">{category.low_demand_days.recommendation}</p>
                
                {/* Hover tooltip for dates */}
                {hoveredRecommendation === 'low-' + category.category && category.low_demand_days.dates.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-black/90 border border-yellow-500/30 rounded p-2 z-10 text-sm">
                    <h5 className="text-yellow-400 mb-1">{t('lowDemandDates') || 'Low Demand Dates'}:</h5>
                    <div className="flex flex-wrap gap-1">
                      {category.low_demand_days.dates.slice(0, 5).map((date, i) => (
                        <span key={i} className="bg-black/60 px-2 py-1 rounded text-white text-xs">{date}</span>
                      ))}
                      {category.low_demand_days.dates.length > 5 && (
                        <span className="bg-black/60 px-2 py-1 rounded text-white text-xs">
                          +{category.low_demand_days.dates.length - 5} {t('moreDates') || 'more'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-black/60 rounded-lg p-5 border border-cyan-900/30 hover:border-cyan-500/30 transition-all duration-300 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {t('predictiveAnalytics') || 'Predictive Analytics'}
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setDisplayType('bookings')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              displayType === 'bookings'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-black text-gray-400 border border-gray-800 hover:bg-cyan-900/10'
            }`}
          >
            {t('bookings') || 'Bookings'}
          </button>
          <button
            onClick={() => setDisplayType('revenue')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              displayType === 'revenue'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-black text-gray-400 border border-gray-800 hover:bg-green-900/10'
            }`}
          >
            {t('revenue') || 'Revenue'}
          </button>
          <button
            onClick={() => setDisplayType('pricing')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              displayType === 'pricing'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-black text-gray-400 border border-gray-800 hover:bg-yellow-900/10'
            }`}
          >
            {t('pricing') || 'Pricing'}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
          {retryCount > 0 && (
            <p className="text-cyan-400 text-sm animate-pulse">
              {t('retrying') || `Retrying... (${retryCount}/${maxRetries})`}
            </p>
          )}
          {retryCount >= 2 && (
            <button
              onClick={() => {
                setUseFallbackData(true);
                setPredictionData(demoData);
                setLoading(false);
                setError(null);
              }}
              className="mt-4 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-md text-sm transition-colors"
            >
              {t('useDemoData') || 'Use Demo Data'}
            </button>
          )}
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-10 h-64 flex items-center justify-center flex-col">
          <p>{error}</p>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => {
                setRetryCount(0);
                fetchPredictionData(true);
              }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-md text-sm transition-colors"
            >
              {t('retry') || 'Retry'}
            </button>
            <button 
              onClick={() => {
                setUseFallbackData(true);
                setPredictionData(demoData);
                setError(null);
              }}
              className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-md text-sm transition-colors"
            >
              {t('useDemoData') || 'Use Demo Data'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {displayType === 'bookings' && (
            <div>
              <div className="mb-4 text-gray-400 text-sm">
                <div className="flex items-center mb-1">
                  <span className="w-3 h-3 bg-cyan-400 rounded-full mr-2"></span>
                  <span>{t('bookingForecastInfo') || 'AI-driven booking predictions for the next 14 days'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-cyan-400/30 rounded-full mr-2"></span>
                  <span>{t('confidenceInterval') || 'Shaded area shows 95% confidence interval'}</span>
                </div>
                {useFallbackData && (
                  <div className="mt-1 px-2 py-1 bg-yellow-500/10 text-yellow-300 text-xs rounded-md inline-block">
                    {t('demoDataShown') || 'Demo data shown'}
                  </div>
                )}
              </div>
              
              <div className="h-64 relative rounded-lg overflow-hidden border border-cyan-900/20">
                {prepareBookingChartData() ? (
                  <Line data={prepareBookingChartData()} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">{t('noBookingData') || 'No booking prediction data available'}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-black/40 rounded-lg p-3 border border-cyan-900/30">
                  <h3 className="text-cyan-400 text-sm mb-1">{t('weekendPrediction') || 'Weekend Prediction'}</h3>
                  <p className="text-xl font-semibold text-white">+35% {t('moreBookings') || 'more bookings'}</p>
                </div>
                <div className="bg-black/40 rounded-lg p-3 border border-cyan-900/30">
                  <h3 className="text-cyan-400 text-sm mb-1">{t('nextPeakDay') || 'Next Peak Day'}</h3>
                  <p className="text-xl font-semibold text-white">{new Date().getDate() + 5}/{new Date().getMonth() + 1}</p>
                </div>
              </div>
            </div>
          )}
          
          {displayType === 'revenue' && (
            <div>
              <div className="mb-4 text-gray-400 text-sm">
                <div className="flex items-center mb-1">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                  <span>{t('revenueForecastInfo') || 'Predicted revenue for the next 14 days based on booking forecasts'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-400/30 rounded-full mr-2"></span>
                  <span>{t('confidenceInterval') || 'Shaded area shows 95% confidence interval'}</span>
                </div>
                {useFallbackData && (
                  <div className="mt-1 px-2 py-1 bg-yellow-500/10 text-yellow-300 text-xs rounded-md inline-block">
                    {t('demoDataShown') || 'Demo data shown'}
                  </div>
                )}
              </div>
              
              <div className="h-64 relative rounded-lg overflow-hidden border border-green-900/20">
                {prepareRevenueChartData() ? (
                  <Line data={prepareRevenueChartData()} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">{t('noRevenueData') || 'No revenue forecast data available'}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-black/40 rounded-lg p-3 border border-green-900/30">
                  <h3 className="text-green-400 text-sm mb-1">{t('monthlyForecast') || 'Monthly Forecast'}</h3>
                  <p className="text-xl font-semibold text-white">$34,750</p>
                </div>
                <div className="bg-black/40 rounded-lg p-3 border border-green-900/30">
                  <h3 className="text-green-400 text-sm mb-1">{t('forecastAccuracy') || 'Forecast Accuracy'}</h3>
                  <p className="text-xl font-semibold text-white">92%</p>
                </div>
              </div>
            </div>
          )}
          
          {displayType === 'pricing' && renderPricingRecommendations()}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
        <div>
          {t('lastUpdated') || 'Last updated'}: <span className="text-cyan-400">{new Date().toLocaleTimeString()}</span>
          {useFallbackData && (
            <span className="ml-2 text-yellow-400">({t('demoMode') || 'Demo Mode'})</span>
          )}
        </div>
        
        <div className="flex gap-2">
          {useFallbackData && (
            <button
              onClick={() => {
                setUseFallbackData(false);
                setRetryCount(0);
                fetchPredictionData(true);
              }}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              {t('switchToLiveData') || 'Switch to Live Data'}
            </button>
          )}
          <button 
            onClick={() => {
              if (useFallbackData) {
                // Just refresh the view with new random demo data
                setPredictionData({...demoData});
              } else {
                setRetryCount(0);
                fetchPredictionData(true);
              }
            }}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {t('refreshData') || 'Refresh Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics; 