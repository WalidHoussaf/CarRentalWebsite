import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/patterns/dot-pattern.svg')] bg-repeat opacity-10"></div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        </div>
      </div>
      
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* 404 Number */}
        <div className="relative mb-4">
          <h1 className="text-9xl font-bold font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-400 to-transparent">404</h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-12 bg-cyan-500/10 blur-2xl"></div>
        </div>
        
        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-['Orbitron']">
          {language === 'fr' ? 'Page non trouvée' : 'Page Not Found'}
        </h2>
        
        <p className="text-gray-400 mb-8 max-w-lg mx-auto font-['Orbitron']">
          {language === 'fr' 
            ? "La page que vous recherchez n'existe pas ou a été déplacée. Veuillez vérifier l'URL ou retourner à l'accueil."
            : "The page you're looking for doesn't exist or has been moved. Please check the URL or return to the homepage."}
        </p>
        
        {/* Back to Home Button */}
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-3 rounded-md font-['Orbitron'] bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          {language === 'fr' ? "Retour à l'accueil" : "Back to Home"}
        </Link>
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent rounded-full blur-sm"></div>
    </div>
  );
};

export default NotFound;
