import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const Testimonials = ({ testimonials }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <section className="relative py-24 px-4 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-black to-blue-700/10 pointer-events-none"></div>
      
      {/* Grid Lines Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #3B82F6 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-2xl md:text-5xl font-semibold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] leading-[1.2]">
          {t('customerTestimonials')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Map Through Testimonials Data */}
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group relative bg-black/80 rounded-xl overflow-hidden border border-gray-800 transform transition-all duration-500 hover:scale-105 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              {/* Digital Noise Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-blue-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="p-6">
                {/* Quote mark */}
                <div className="absolute top-4 right-4 text-5xl text-white font-serif group-hover:text-gray-400 transition-colors duration-300">"</div>
                
                <div className="flex items-center mb-6 relative">
                  <div className="w-16 h-16 rounded-full border-2 border-white group-hover:border-blue-500 transition-colors duration-300 mr-4 overflow-hidden relative">
                    {/* Image glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    <img
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white group-hover:text-blue-500 transition-colors duration-300 font-['Orbitron']">
                      {t(`testimonial_${testimonial.name.toLowerCase().replace(/\s+/g, '_')}_name`) || testimonial.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-['Orbitron']">
                      {t(`testimonial_${testimonial.name.toLowerCase().replace(/\s+/g, '_')}_title`) || testimonial.title}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 font-['Orbitron'] text-2xs leading-relaxed text-justify">
                  "{t(`testimonial_${testimonial.name.toLowerCase().replace(/\s+/g, '_')}_quote`) || testimonial.quote}"
                </p>
                
                {/* Star Rating Design */}
                <div className="flex space-x-2 relative">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <div key={i} className="relative">
                      {/* Geometric Star Design */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        <circle cx="12" cy="12" r="2" fill="rgba(255, 215, 0, 0.5)" className="group-hover:fill-yellow-200 transition-colors duration-300" />
                      </svg>
                      <div className="absolute inset-0 bg-yellow-500/40 blur-[1px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    </div>
                  ))}
                </div>
                
                {/* Progress Indicator */}
                <div className="w-full h-0.5 bg-gray-800 mt-6 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-white to-cyan-500 animate-pulse" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Read More Button */}
        <div className="mt-12 text-center">
          <Link 
            to="/reviews" 
            className="group relative inline-flex items-center px-6 py-3 overflow-hidden rounded-md bg-black/50 border border-cyan-500/50 hover:border-blue-400/50 transition-all duration-300"
          >
            {/* Animated Background Effect */}
            <div className="absolute inset-0 w-3 bg-gradient-to-r from-blue-500/20 to-blue-400/20 transition-all duration-500 group-hover:w-full"></div>
            
            <span className="relative z-10 text-white group-hover:text-blue-300 transition-colors duration-300 font-['Orbitron']">
              {t('readMoreReviews')}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-5 w-5 ml-2 text-white group-hover:text-blue-300 transition-colors duration-300 transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;