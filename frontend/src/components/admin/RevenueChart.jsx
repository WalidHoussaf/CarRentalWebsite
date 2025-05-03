import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const RevenueChart = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [timeRange, setTimeRange] = useState('month');

  // Sample revenue data - in a real app, this would come from an API
  const revenueData = {
    daily: [
      { date: '01', revenue: 3400 },
      { date: '02', revenue: 2800 },
      { date: '03', revenue: 3200 },
      { date: '04', revenue: 4500 },
      { date: '05', revenue: 4200 },
      { date: '06', revenue: 3800 },
      { date: '07', revenue: 5100 },
      { date: '08', revenue: 4900 },
      { date: '09', revenue: 5200 },
      { date: '10', revenue: 4700 },
      { date: '11', revenue: 5300 },
      { date: '12', revenue: 6100 },
      { date: '13', revenue: 5800 },
      { date: '14', revenue: 6200 },
    ],
    weekly: [
      { date: 'Week 1', revenue: 21900 },
      { date: 'Week 2', revenue: 25700 },
      { date: 'Week 3', revenue: 29400 },
      { date: 'Week 4', revenue: 32600 },
    ],
    monthly: [
      { date: 'Jan', revenue: 82500 },
      { date: 'Feb', revenue: 89700 },
      { date: 'Mar', revenue: 97300 },
      { date: 'Apr', revenue: 109800 },
      { date: 'May', revenue: 118500 },
      { date: 'Jun', revenue: 127200 },
    ],
  };

  // Get current data based on selected time range
  const currentData = revenueData[timeRange === 'day' ? 'daily' : timeRange === 'week' ? 'weekly' : 'monthly'];
  
  // Calculate total revenue for the selected period
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  
  // Calculate percentage change from previous period
  // In a real app, this would use actual historical data
  const previousPeriodRevenue = totalRevenue * 0.92; // Simulating a 8% growth
  const percentageChange = Math.round(((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100);
  
  // Find max value for scaling the chart
  const maxRevenue = Math.max(...currentData.map(item => item.revenue));
  
  // For the sparkline trend
  const trendData = [12, 15, 18, 14, 19, 16, 20, 22, 19, 24, 25, 23];

  // Calculate the highest revenue day/week/month
  const highestRevenueItem = [...currentData].sort((a, b) => b.revenue - a.revenue)[0];

  // Helper function to format revenue values
  const formatRevenue = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  // Generate the bar chart
  const renderBarChart = () => {
    return (
      <div className="h-60 flex items-end justify-between space-x-1">
        {currentData.map((item, index) => {
          const height = (item.revenue / maxRevenue) * 100;
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-6 cursor-pointer transition-all duration-300 hover:opacity-80 rounded-t"
                style={{ 
                  height: `${height}%`, 
                  background: `linear-gradient(to top, rgba(0, 191, 255, 0.3), rgba(0, 191, 255, 0.7))`,
                  boxShadow: item.revenue === highestRevenueItem.revenue ? '0 0 8px rgba(0, 191, 255, 0.8)' : 'none'
                }}
                title={`${item.date}: ${formatRevenue(item.revenue)}`}
              ></div>
              <div className="text-xs text-gray-400 mt-2">{item.date}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Generate the sparkline
  const renderSparkline = () => {
    const points = trendData
      .map((value, index) => `${(index / (trendData.length - 1)) * 100},${100 - (value / Math.max(...trendData)) * 100}`)
      .join(' ');

    return (
      <svg width="100%" height="30" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke="rgba(0, 191, 255, 0.7)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={(trendData.length - 1) / (trendData.length - 1) * 100}
          cy={100 - (trendData[trendData.length - 1] / Math.max(...trendData)) * 100}
          r="3"
          fill="rgba(0, 191, 255, 1)"
        />
      </svg>
    );
  };

  return (
    <div className="bg-black/60 rounded-lg p-5 border border-cyan-900/30 hover:border-cyan-500/30 transition-all duration-300 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 flex items-center font-orbitron">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('revenueAnalytics') || 'Revenue Analytics'}
        </h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1 text-xs rounded transition-colors ${timeRange === 'day' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-black/40 text-gray-400 hover:text-gray-300'}`}
          >
            {t('daily') || 'Daily'}
          </button>
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 text-xs rounded transition-colors ${timeRange === 'week' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-black/40 text-gray-400 hover:text-gray-300'}`}
          >
            {t('weekly') || 'Weekly'}
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 text-xs rounded transition-colors ${timeRange === 'month' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-black/40 text-gray-400 hover:text-gray-300'}`}
          >
            {t('monthly') || 'Monthly'}
          </button>
        </div>
      </div>
      
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/20">
          <div className="text-gray-400 text-xs mb-1">{t('totalRevenue') || 'Total Revenue'}</div>
          <div className="flex items-end">
            <span className="text-xl font-semibold text-white">{formatRevenue(totalRevenue)}</span>
            <span className={`ml-2 text-sm ${percentageChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange)}%
            </span>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/20">
          <div className="text-gray-400 text-xs mb-1">{t('averageRevenue') || 'Average Revenue'}</div>
          <div className="flex items-end">
            <span className="text-xl font-semibold text-white">{formatRevenue(totalRevenue / currentData.length)}</span>
            <span className="ml-2 text-xs text-gray-500">/{timeRange === 'day' ? 'day' : timeRange === 'week' ? 'week' : 'month'}</span>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/20">
          <div className="text-gray-400 text-xs mb-1">{t('projected') || 'Projected Annual'}</div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-white">
              {formatRevenue(timeRange === 'day' ? totalRevenue * 365 / currentData.length : 
                             timeRange === 'week' ? totalRevenue * 52 / currentData.length : 
                             totalRevenue * 12 / currentData.length)}
            </span>
            <div className="mt-1 h-4">
              {renderSparkline()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Highest Revenue Card */}
      <div className="bg-gradient-to-r from-black/80 to-cyan-900/10 p-4 rounded-lg border border-cyan-500/20 mb-6">
        <div className="text-xs text-cyan-400 mb-2">{t('highestRevenue') || 'HIGHEST REVENUE'}</div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white font-medium">
              {highestRevenueItem.date}
              <span className="ml-2 text-xs text-gray-400">
                ({timeRange === 'day' ? 'Day' : timeRange === 'week' ? 'Week' : 'Month'})
              </span>
            </h3>
            <div className="text-gray-400 text-xs mt-1">
              {t('revenue') || 'Revenue'}: <span className="text-white">{formatRevenue(highestRevenueItem.revenue)}</span>
            </div>
          </div>
          <div className="bg-cyan-500/10 h-12 w-12 rounded-full flex items-center justify-center">
            <span className="text-lg text-cyan-400">🏆</span>
          </div>
        </div>
      </div>
      
      {/* Revenue Chart */}
      <div className="bg-black/40 rounded-lg p-4 border border-cyan-900/20 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-300">
            {timeRange === 'day' ? t('dailyRevenue') || 'Daily Revenue' : 
             timeRange === 'week' ? t('weeklyRevenue') || 'Weekly Revenue' : 
             t('monthlyRevenue') || 'Monthly Revenue'}
          </h3>
          <div className="text-xs text-cyan-400 cursor-pointer hover:text-cyan-300">
            {t('downloadReport') || 'Download Report'}
          </div>
        </div>
        
        {renderBarChart()}
      </div>
      
      <div className="mt-2 text-right">
        <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-orbitron">
          {t('revenueForecast') || 'Revenue Forecast'} 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RevenueChart; 