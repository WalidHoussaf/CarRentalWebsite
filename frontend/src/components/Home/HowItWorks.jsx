import React, { useState, useRef } from 'react';
import FloatingParticles from '../Ui/FloatingParticles';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(null);
  const howItWorksRef = useRef(null);
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <section ref={howItWorksRef} className="relative py-20 px-4 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingParticles containerRef={howItWorksRef} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-purple-900/10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-100">
        <h2 className="text-2xl md:text-5xl font-semibold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] leading-[1.2]">
          {t('howItWorks')}
        </h2>

        <div className="relative">
          {/* Timeline */}
          <div className="hidden md:block absolute top-10 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 z-0">
            {/* Timeline Base */}
            <div className={`absolute inset-0 h-full bg-gradient-to-r from-white via-cyan-400 to-white ${activeStep !== null ? 'animate-pulse' : ''} transition-all duration-500 opacity-70`}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
            <div 
              className="relative flex flex-col items-center text-center group"
              onMouseEnter={() => setActiveStep(0)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Number Circle */}
              <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center mb-8 shadow-lg relative z-10 border-2 border-cyan-400 group-hover:border-cyan-500 transition-all duration-500">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-600/20 blur opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="text-2xl font-bold text-white relative z-10 font-['Orbitron']">01</span>
              </div>

              {/* Content Card */}
              <div className="p-6 rounded-lg bg-black/80 border border-gray-800 transform transition-all duration-500 hover:scale-105 hover:border-blue-500/50 w-full h-full flex flex-col items-center group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <h3 className="text-2xl font-semibold mb-4 font-['Orbitron'] text-cyan-400 group-hover:text-cyan-400 transition-colors duration-300">{t('search')}</h3>
                <p className="text-gray-300 font-['Orbitron'] text-4xs">{t('searchDescription')}</p>

                <div className="mt-6 w-14 h-14 rounded-full bg-black/60 flex items-center justify-center border border-gray-700 group-hover:border-cyan-400 transition-all duration-300 overflow-hidden">
                  {/* Animated Search Icon */}
                  <div className="relative w-6 h-6 group-hover:animate-[search_1.5s_ease-in-out_infinite]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 h-6 w-6 text-cyan-400 group-hover:text-cyan-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-auto pt-4 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-cyan-400 font-['Orbitron']">
                      {t('step')} 1/3
                    </span>
                    <span className="text-xs text-cyan-400 font-['Orbitron']">
                      {t('search')}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-white to-cyan-600 rounded-full transition-all duration-500 animate-pulse"
                      style={{ width: "33%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="relative flex flex-col items-center text-center group"
              onMouseEnter={() => setActiveStep(1)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Number Circle */}
              <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center mb-8 shadow-lg relative z-10 border-2 border-cyan-400 group-hover:border-cyan-500 transition-all duration-500">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-600/20 blur opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="text-2xl font-bold text-white relative z-10 font-['Orbitron']">02</span>
              </div>

              {/* Content Card */}
              <div className="p-6 rounded-lg bg-black/80 border border-gray-800 transform transition-all duration-500 hover:scale-105 hover:border-blue-500/50 w-full h-full flex flex-col items-center group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <h3 className="text-2xl font-semibold mb-4 font-['Orbitron'] text-cyan-400 group-hover:text-cyan-400 transition-colors duration-300">{t('book')}</h3>
                <p className="text-gray-300 font-['Orbitron'] text-4xs">{t('bookDescription')}</p>

                <div className="mt-6 w-14 h-14 rounded-full bg-black/60 flex items-center justify-center border border-gray-700 group-hover:border-cyan-400 transition-all duration-300 overflow-hidden">
                  {/* Calendar Icon */}
                  <div className="relative w-6 h-6 perspective-500">
                    {/* Back Calendar Page */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 h-6 w-6 text-cyan-400 group-hover:text-cyan-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    
                    {/* Front Calendar Page */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 origin-left transition-all duration-300 group-hover:animate-[pageFlip_2s_ease-in-out_infinite]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-4 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-cyan-400 font-['Orbitron']">
                      {t('step')} 2/3
                    </span>
                    <span className="text-xs text-cyan-400 font-['Orbitron']">
                      {t('book')}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-white to-cyan-600 rounded-full transition-all duration-500 animate-pulse"
                      style={{ width: "66%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="relative flex flex-col items-center text-center group"
              onMouseEnter={() => setActiveStep(2)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Number Circle */}
              <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center mb-8 shadow-lg relative z-10 border-2 border-cyan-400 group-hover:border-cyan-500 transition-all duration-500">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-600/20 blur opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="text-2xl font-bold text-white relative z-10 font-['Orbitron']">03</span>
              </div>

              {/* Content Card */}
              <div className="p-6 rounded-lg bg-black/80 border border-gray-800 transform transition-all duration-500 hover:scale-105 hover:border-blue-500/50 w-full h-full flex flex-col items-center group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <h3 className="text-2xl font-semibold mb-4 font-['Orbitron'] text-cyan-400 group-hover:text-cyan-400 transition-colors duration-300">{t('enjoy')}</h3>
                <p className="text-gray-300 font-['Orbitron'] text-4xs">{t('enjoyDescription')}</p>

                <div className="mt-6 w-14 h-14 rounded-full bg-black/60 flex items-center justify-center border border-gray-700 group-hover:border-cyan-500 transition-all duration-300 overflow-hidden">
                  {/* Animated Smiley Face */}
                  <div className="relative w-6 h-6">
                    {/* Default smiley */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 h-6 w-6 text-cyan-400 group-hover:text-cyan-500 transition-colors duration-300 group-hover:opacity-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    
                    {/* Happy smiley */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 h-6 w-6 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:animate-[bounce_1s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h.01M15 10h.01" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14s1.5 2 4 2 4-2 4-2" />
                    </svg>
                  </div>
                </div>
                <div className="mt-auto pt-4 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-cyan-400 font-['Orbitron']">
                      {t('step')} 3/3
                    </span>
                    <span className="text-xs text-cyan-400 font-['Orbitron']">
                      {t('enjoy')}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-white to-cyan-600 rounded-full transition-all duration-500 animate-pulse"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;