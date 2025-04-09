import React from 'react';
import { assets } from '../../assets/assets';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const HeroSection = ({ onExploreClick, onLearnMoreClick }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  return (
    <section className="relative h-screen max-h-[600px] bg-black overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src={assets.hero.ourfleetbg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-3 py-1 rounded-full bg-cyan-500/10 border border-blue-500/20">
            <span className="text-sm text-cyan-400 font-['Orbitron'] tracking-widest">{t('experienceTheFuture')}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white font-['Orbitron'] mb-6 tracking-tight relative">
            {t('ourFleet')}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0"></div>
          </h1>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-['Orbitron'] leading-relaxed mb-8">
            {t('discoverFleetDescription')}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
            onClick={onExploreClick}
            className="px-6 py-3 rounded-md bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-['Orbitron'] transition-all duration-300 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/30 cursor-pointer">
              {t('exploreCars')}
            </button>
            <button 
            onClick={onLearnMoreClick}
            className="px-6 py-3 rounded-md bg-transparent border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 font-['Orbitron'] transition-all duration-300 cursor-pointer">
              {t('learnMore')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center">
        <div className="animate-bounce p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;