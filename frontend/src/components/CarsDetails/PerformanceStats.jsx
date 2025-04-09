import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const PerformanceStats = ({ specifications }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <section className="py-12 bg-gradient-to-b from-black via-blue-950/50 to-black border-t border-b border-blue-500/20 backdrop-blur-lg relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-600 filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-indigo-700 filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full grid grid-cols-24 grid-rows-12">
          {[...Array(288)].map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan-400/30"></div>
          ))}
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] tracking-widest">
            {t('performanceMetrics')}
          </h2>
          <div className="w-32 h-[2px] bg-gradient-to-r from-white to-cyan-400 mt-3 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Engine Stat Card */}
          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-blue-500/20 rounded-xl blur group-hover:blur-xl transform transition-all duration-500 -z-10"></div>
            <div className="text-center p-6 rounded-xl border border-cyan-400 bg-gradient-to-br from-black/90 to-blue-950/40 backdrop-blur-md transform transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-blue-600/30 h-full flex flex-col justify-between group-hover:rotate-y-10">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-grow flex items-center justify-center mb-4">
                <div className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white font-['Tomorrow']">
                  {specifications.engine} 
                </div>
              </div>
              <div className="mt-auto">
                <div className="text-gray-300 font-['Tomorrow'] text-xs tracking-wider pt-2 border-t border-cyan-500/20">{t('engine')}</div>
              </div>
            </div>
          </div>
          
          {/* Acceleration Stat Card */}
          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-blue-500/20 rounded-xl blur group-hover:blur-xl transform transition-all duration-500 -z-10"></div>
            <div className="text-center p-6 rounded-xl border border-cyan-400 bg-gradient-to-br from-black/90 to-blue-950/40 backdrop-blur-md transform transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-blue-600/30 h-full flex flex-col justify-between group-hover:rotate-y-10">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-grow flex items-center justify-center mb-4">
                <div className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white font-['Tomorrow']">
                  {specifications.acceleration} 
                </div>
              </div>
              <div className="mt-auto">
                <div className="text-gray-300 font-['Tomorrow'] text-xs tracking-wider pt-2 border-t border-cyan-500/20">{t('acceleration')}</div>
              </div>
            </div>
          </div>
          
          {/* Horsepower Stat Card */}
          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-blue-500/20 rounded-xl blur group-hover:blur-xl transform transition-all duration-500 -z-10"></div>
            <div className="text-center p-6 rounded-xl border border-cyan-400 bg-gradient-to-br from-black/90 to-blue-950/40 backdrop-blur-md transform transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-blue-600/30 h-full flex flex-col justify-between group-hover:rotate-y-10">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="flex-grow flex items-center justify-center mb-4">
                <div className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white font-['Tomorrow']">
                  {specifications.power} 
                </div>
              </div>
              <div className="mt-auto">
                <div className="text-gray-300 font-['Tomorrow'] text-xs tracking-wider pt-2 border-t border-cyan-500/20">{t('horsepower')}</div>
              </div>
            </div>
          </div>
          
          {/* Fuel Economy Stat Card */}
          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-blue-500/20 rounded-xl blur group-hover:blur-xl transform transition-all duration-500 -z-10"></div>
            <div className="text-center p-6 rounded-xl border border-cyan-400 bg-gradient-to-br from-black/90 to-blue-950/40 backdrop-blur-md transform transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-blue-600/30 h-full flex flex-col justify-between group-hover:rotate-y-10">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </div>
              <div className="flex-grow flex items-center justify-center mb-4">
                <div className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white font-['Tomorrow']">
                  {specifications.fuelEconomy} 
                </div>
              </div>
              <div className="mt-auto">
                <div className="text-gray-300 font-['Tomorrow'] text-xs tracking-wider pt-2 border-t border-cyan-500/20">{t('fuelEconomy')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceStats;