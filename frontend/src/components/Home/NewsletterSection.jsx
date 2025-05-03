import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const { language } = useLanguage();
  const t = useTranslations(language);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the email submission silently - can be replaced with actual API call
    setEmail('');
  };

  return (
    <section className="relative py-16 px-4 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-black to-purple-900/10 pointer-events-none"></div>
      
      {/* Grid Lines Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-2xl md:text-4xl font-semibold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] leading-[1.2]">
          {t('stayConnected')}
        </h2>
        
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-center font-['Orbitron'] text-sm md:text-base">
          {t('newsletterDescription')}
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          {/* Tech Border Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-white rounded-lg opacity-50 blur-sm group-hover:opacity-75 transition duration-300"></div>
          
          <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-4 justify-center bg-black/50 p-2 rounded-lg backdrop-blur-sm border border-gray-800">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              required
              className="px-6 py-3 rounded-md bg-black/80 border border-gray-700 text-white w-full flex-grow focus:outline-none focus:border-blue-500 transition-all duration-300 font-['Orbitron'] text-2xs placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="group relative px-6 py-3 bg-gradient-to-r from-cyan-400 to-white text-black font-medium rounded-md transition-all duration-300 transform hover:scale-105 overflow-hidden font-['Orbitron'] cursor-pointer"
            >
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-cyan-400/30 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              {/* Digital Noise On Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute h-px w-full bg-blue-400/30"
                    style={{ 
                      top: `${Math.random() * 100}%`,
                      animation: 'scanline 3s linear infinite',
                      animationDelay: `${i * 0.5}s`
                    }}
                  ></div>
                ))}
              </div>
              
              <span className="relative z-10 flex items-center justify-center pl-2">
                {t('subscribe')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
          </form>
          
          {/* Tech corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white opacity-70"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 opacity-70"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white opacity-70"></div>
        </div>
        
        <p className="text-gray-500 text-sm text-center mt-4 font-['Orbitron']">
          {t('privacyNotice')}
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;