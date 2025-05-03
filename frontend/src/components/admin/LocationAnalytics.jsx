import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const LocationAnalytics = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [viewMode, setViewMode] = useState('map');
  
  // Sample location data - in a real app, this would come from an API
  const locationData = [
    { id: 1, name: 'Downtown', pickups: 342, dropoffs: 287, revenue: 28700, growth: 12 },
    { id: 2, name: 'Airport', pickups: 529, dropoffs: 451, revenue: 52900, growth: 24 },
    { id: 3, name: 'Central Station', pickups: 218, dropoffs: 256, revenue: 18600, growth: 5 },
    { id: 4, name: 'South Beach', pickups: 187, dropoffs: 204, revenue: 19200, growth: -3 },
    { id: 5, name: 'West End', pickups: 134, dropoffs: 158, revenue: 12300, growth: 8 },
  ];
  
  // Calculate analytics
  const totalPickups = locationData.reduce((sum, location) => sum + location.pickups, 0);
  const totalDropoffs = locationData.reduce((sum, location) => sum + location.dropoffs, 0);
  const totalRevenue = locationData.reduce((sum, location) => sum + location.revenue, 0);
  
  // Sort locations by revenue
  const topLocationsByRevenue = [...locationData].sort((a, b) => b.revenue - a.revenue);
  const topLocation = topLocationsByRevenue[0];
  
  // Calculate growth indicator
  const overallGrowth = Math.round(locationData.reduce((sum, location) => sum + location.growth, 0) / locationData.length);
  
  // Helper function to get percentage
  const getPercentage = (value, total) => {
    return Math.round((value / total) * 100);
  };
  
  // Helper function to get color based on growth
  const getGrowthColor = (growth) => {
    if (growth > 10) return 'text-green-400';
    if (growth > 0) return 'text-cyan-400';
    if (growth === 0) return 'text-gray-400';
    return 'text-red-400';
  };
  
  // Helper function to get growth icon
  const getGrowthIcon = (growth) => {
    if (growth > 0) return '↑';
    if (growth === 0) return '→';
    return '↓';
  };
  
  // Generate random map markers for the demo - would be replaced with actual data
  const generateMapMarkers = () => {
    return locationData.map(location => {
      const size = Math.max(30, Math.min(100, location.pickups / 10));
      const left = Math.random() * 80 + 10;
      const top = Math.random() * 80 + 10;
      
      return (
        <div 
          key={location.id}
          className="absolute rounded-full bg-cyan-400/30 border border-cyan-400/70 flex items-center justify-center cursor-pointer hover:bg-cyan-400/50 transition-all duration-300"
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            transform: 'translate(-50%, -50%)'
          }}
          title={location.name}
        >
          <span className="text-xs text-white font-semibold">{location.name.charAt(0)}</span>
        </div>
      );
    });
  };

  return (
    <div className="bg-black/60 rounded-lg p-5 border border-cyan-900/30 hover:border-cyan-500/30 transition-all duration-300 h-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 flex items-center font-orbitron">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t('locationAnalytics') || 'Location Analytics'}
        </h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 text-xs rounded transition-colors ${viewMode === 'map' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-black/40 text-gray-400 hover:text-gray-300'}`}
          >
            {t('mapView') || 'Map View'}
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-xs rounded transition-colors ${viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-black/40 text-gray-400 hover:text-gray-300'}`}
          >
            {t('tableView') || 'Table View'}
          </button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/20">
          <div className="text-gray-400 text-xs mb-1">{t('totalPickups') || 'Total Pickups'}</div>
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">{totalPickups}</span>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/20">
          <div className="text-gray-400 text-xs mb-1">{t('totalDropoffs') || 'Total Dropoffs'}</div>
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">{totalDropoffs}</span>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/20">
          <div className="text-gray-400 text-xs mb-1">{t('totalRevenue') || 'Total Revenue'}</div>
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">${totalRevenue.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/20">
          <div className="text-gray-400 text-xs mb-1">{t('overallGrowth') || 'Growth'}</div>
          <div className="flex items-center">
            <span className={`text-xl font-semibold ${getGrowthColor(overallGrowth)}`}>
              {getGrowthIcon(overallGrowth)} {overallGrowth}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Top Location Card */}
      <div className="bg-gradient-to-r from-black/80 to-cyan-900/10 p-4 rounded-lg border border-cyan-500/20 mb-5">
        <div className="text-xs text-cyan-400 mb-2">{t('topLocation') || 'TOP LOCATION'}</div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white font-medium">{topLocation.name}</h3>
            <div className="text-gray-400 text-xs mt-1">
              {t('revenue') || 'Revenue'}: <span className="text-white">${topLocation.revenue.toLocaleString()}</span>
              <span className={`ml-2 ${getGrowthColor(topLocation.growth)}`}>
                {getGrowthIcon(topLocation.growth)} {topLocation.growth}%
              </span>
            </div>
          </div>
          <div className="bg-cyan-500/10 h-12 w-12 rounded-full flex items-center justify-center">
            <span className="text-lg text-cyan-400">📍</span>
          </div>
        </div>
      </div>
      
      {/* Map or Table View */}
      {viewMode === 'map' ? (
        <div className="relative w-full h-64 bg-black/40 rounded-lg mb-5 border border-cyan-900/20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="cyan" strokeWidth="0.5" opacity="0.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Map markers */}
          {generateMapMarkers()}
          
          {/* Map controls */}
          <div className="absolute bottom-3 right-3 bg-black/70 rounded-lg p-2 flex gap-2">
            <button className="w-6 h-6 rounded bg-black/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-900/30">+</button>
            <button className="w-6 h-6 rounded bg-black/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-900/30">-</button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-500">
                <th className="text-left pb-2">{t('location') || 'LOCATION'}</th>
                <th className="text-center pb-2">{t('pickups') || 'PICKUPS'}</th>
                <th className="text-center pb-2">{t('dropoffs') || 'DROPOFFS'}</th>
                <th className="text-center pb-2">{t('revenue') || 'REVENUE'}</th>
                <th className="text-right pb-2">{t('growth') || 'GROWTH'}</th>
              </tr>
            </thead>
            <tbody>
              {locationData.map(location => (
                <tr key={location.id} className="border-b border-gray-800/50 text-sm hover:bg-black/20">
                  <td className="py-3 text-white">{location.name}</td>
                  <td className="py-3 text-center text-white">
                    {location.pickups}
                    <span className="text-gray-500 text-xs ml-1">({getPercentage(location.pickups, totalPickups)}%)</span>
                  </td>
                  <td className="py-3 text-center text-white">
                    {location.dropoffs}
                    <span className="text-gray-500 text-xs ml-1">({getPercentage(location.dropoffs, totalDropoffs)}%)</span>
                  </td>
                  <td className="py-3 text-center text-white">${location.revenue.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <span className={`${getGrowthColor(location.growth)}`}>
                      {getGrowthIcon(location.growth)} {location.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4 text-right">
        <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-orbitron">
          {t('detailedReport') || 'Detailed Report'} 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LocationAnalytics; 