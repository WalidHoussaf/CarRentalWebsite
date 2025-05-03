import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const CarUsageMetrics = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [selectedMetric, setSelectedMetric] = useState('utilization');
  
  // Sample data - in a real app, this would come from an API
  const carsData = [
    { id: 1, name: 'Tesla Model S', utilizationRate: 87, avgDistance: 532, avgDuration: 3.2, maintenance: 2 },
    { id: 2, name: 'BMW i8', utilizationRate: 92, avgDistance: 478, avgDuration: 2.8, maintenance: 1 },
    { id: 3, name: 'Mercedes EQS', utilizationRate: 76, avgDistance: 312, avgDuration: 2.1, maintenance: 3 },
    { id: 4, name: 'Audi e-tron', utilizationRate: 81, avgDistance: 421, avgDuration: 2.5, maintenance: 2 },
    { id: 5, name: 'Porsche Taycan', utilizationRate: 94, avgDistance: 587, avgDuration: 3.7, maintenance: 0 },
  ];
  
  // Calculate fleet-wide averages
  const fleetUtilization = Math.round(carsData.reduce((sum, car) => sum + car.utilizationRate, 0) / carsData.length);
  const fleetAvgDistance = Math.round(carsData.reduce((sum, car) => sum + car.avgDistance, 0) / carsData.length);
  const fleetAvgDuration = (carsData.reduce((sum, car) => sum + car.avgDuration, 0) / carsData.length).toFixed(1);
  const totalMaintenanceEvents = carsData.reduce((sum, car) => sum + car.maintenance, 0);
  
  // Get highest performing car
  const highestUtilizationCar = [...carsData].sort((a, b) => b.utilizationRate - a.utilizationRate)[0];
  
  // Helper function to determine color based on utilization
  const getUtilizationColor = (rate) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 75) return 'text-cyan-400';
    if (rate >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Helper function to get icon based on maintenance events
  const getMaintenanceIcon = (count) => {
    if (count === 0) return '✓';
    if (count === 1) return '⚠️';
    return '⛔';
  };
  
  return (
    <div className="bg-black/60 rounded-lg p-5 border border-cyan-900/30 hover:border-cyan-500/30 transition-all duration-300 h-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 flex items-center font-orbitron">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {t('carUsageMetrics') || 'Car Usage Metrics'}
        </h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setSelectedMetric('utilization')}
            className={`px-3 py-1 text-xs rounded transition-colors ${selectedMetric === 'utilization' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-black/40 text-gray-400 hover:text-gray-300'}`}
          >
            {t('utilization') || 'Utilization'}
          </button>
          <button 
            onClick={() => setSelectedMetric('distance')}
            className={`px-3 py-1 text-xs rounded transition-colors ${selectedMetric === 'distance' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-black/40 text-gray-400 hover:text-gray-300'}`}
          >
            {t('distance') || 'Distance'}
          </button>
          <button 
            onClick={() => setSelectedMetric('duration')}
            className={`px-3 py-1 text-xs rounded transition-colors ${selectedMetric === 'duration' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-black/40 text-gray-400 hover:text-gray-300'}`}
          >
            {t('duration') || 'Duration'}
          </button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/20">
          <div className="text-gray-400 text-xs mb-1">{t('fleetUtilization') || 'Fleet Utilization'}</div>
          <div className="flex items-center">
            <span className={`text-xl font-semibold ${getUtilizationColor(fleetUtilization)}`}>{fleetUtilization}%</span>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/20">
          <div className="text-gray-400 text-xs mb-1">{t('avgDistance') || 'Avg. Distance'}</div>
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">{fleetAvgDistance} km</span>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/20">
          <div className="text-gray-400 text-xs mb-1">{t('avgDuration') || 'Avg. Duration'}</div>
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">{fleetAvgDuration} {t('days') || 'days'}</span>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-lg border border-cyan-900/20">
          <div className="text-gray-400 text-xs mb-1">{t('maintenanceEvents') || 'Maintenance'}</div>
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">{totalMaintenanceEvents}</span>
          </div>
        </div>
      </div>
      
      {/* Top Performer Card */}
      <div className="bg-gradient-to-r from-black/80 to-cyan-900/10 p-4 rounded-lg border border-cyan-500/20 mb-5">
        <div className="text-xs text-cyan-400 mb-2">{t('topPerformer') || 'TOP PERFORMER'}</div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white font-medium">{highestUtilizationCar.name}</h3>
            <div className="text-gray-400 text-xs mt-1">
              {t('utilizationRate') || 'Utilization Rate'}: <span className={getUtilizationColor(highestUtilizationCar.utilizationRate)}>{highestUtilizationCar.utilizationRate}%</span>
            </div>
          </div>
          <div className="bg-cyan-500/10 h-12 w-12 rounded-full flex items-center justify-center">
            <span className="text-lg text-cyan-400">👑</span>
          </div>
        </div>
      </div>
      
      {/* Detailed Car Metrics Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-500">
              <th className="text-left pb-2">{t('carModel') || 'CAR MODEL'}</th>
              <th className="text-center pb-2">
                {selectedMetric === 'utilization' && (t('utilization') || 'UTILIZATION')}
                {selectedMetric === 'distance' && (t('avgDistance') || 'AVG DISTANCE')}
                {selectedMetric === 'duration' && (t('avgDuration') || 'AVG DURATION')}
              </th>
              <th className="text-center pb-2">{t('maintenance') || 'MAINTENANCE'}</th>
              <th className="text-right pb-2">{t('status') || 'STATUS'}</th>
            </tr>
          </thead>
          <tbody>
            {carsData.map(car => (
              <tr key={car.id} className="border-b border-gray-800/50 text-sm hover:bg-black/20">
                <td className="py-3 text-white">{car.name}</td>
                <td className="py-3 text-center">
                  {selectedMetric === 'utilization' && (
                    <span className={getUtilizationColor(car.utilizationRate)}>{car.utilizationRate}%</span>
                  )}
                  {selectedMetric === 'distance' && (
                    <span className="text-white">{car.avgDistance} km</span>
                  )}
                  {selectedMetric === 'duration' && (
                    <span className="text-white">{car.avgDuration} {t('days') || 'days'}</span>
                  )}
                </td>
                <td className="py-3 text-center">
                  <span className={car.maintenance === 0 ? 'text-green-400' : car.maintenance === 1 ? 'text-yellow-400' : 'text-red-400'}>
                    {getMaintenanceIcon(car.maintenance)}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${car.utilizationRate > 85 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {car.utilizationRate > 85 ? (t('optimal') || 'Optimal') : (t('underutilized') || 'Under-utilized')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-right">
        <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-orbitron">
          {t('exportMetrics') || 'Export Metrics'} 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CarUsageMetrics; 