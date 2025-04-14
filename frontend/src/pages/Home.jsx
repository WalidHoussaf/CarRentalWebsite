import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { assets, resolveImagePaths } from '../assets/assets';
import HowItWorks from '../components/Home/HowItWorks';
import FeaturedCars from '../components/Home/FeaturedCars';
import PopularDestinations from '../components/Home/PopularDestinations';
import Testimonials from '../components/Home/Testimonials';
import NewsletterSection from '../components/Home/NewsletterSection';
import '../styles/animations.css'; 
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Hero Slides Captions 
  const heroMessages = [
    {
      title: language === 'en' ? "Luxury Cars, Affordable Prices" : "Voitures de Luxe, Prix Abordables",
      subtitle: language === 'en' ? "Enjoy Luxury Rides at an Unbeatable Price" : "Profitez de Voyages de Luxe à un Prix Imbattable"
    },
    {
      title: language === 'en' ? "Discover New Horizons" : "Découvrez de Nouveaux Horizons",
      subtitle: language === 'en' ? "The perfect vehicle for every adventure" : "Le véhicule parfait pour chaque aventure"
    },
    {
      title: language === 'en' ? "Quick & Easy Booking" : "Réservation Rapide & Facile",
      subtitle: language === 'en' ? "Your journey begins with just a few clicks" : "Votre voyage commence en quelques clics"
    }
  ];
  
  // Get Data From Assets.js
  const featuredCars = resolveImagePaths(assets.data.featuredCars, 'image');
  const destinations = resolveImagePaths(assets.data.destinations, 'image');
  const testimonials = resolveImagePaths(assets.data.testimonials, 'photo');

  // Auto-Rotate Hero Captions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroMessages.length]);

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60" />
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={assets.hero.backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 z-10 opacity-30 bg-gradient-to-b from-blue-900/0 via-cyan-900/10 to-black"></div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
          <div className="flex flex-col items-center" style={{ minHeight: '320px' }}>
            {/* Title container with fixed height */}
            <div className="flex flex-col justify-center items-center h-64">
              <h1 className="text-4xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] text-center break-words px-4 leading-[1.2]">
                {heroMessages[currentSlide].title}
              </h1>
              <p className="text-sm md:text-xl max-w-2xl text-gray-200 font-['Orbitron'] break-words px-4">
                {heroMessages[currentSlide].subtitle}
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mt-8">
              <Link
                to="/cars"
                className="relative overflow-hidden group px-10 py-4 bg-gradient-to-r from-white to-cyan-500 rounded-md font-bold text-black transform transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/20"
              >
                <span className="relative z-10 font-['Orbitron'] text-lg">{t('exploreOurFleet')}</span>
                <span className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-cyan-500 to-white transition-all duration-300 group-hover:h-full group-hover:opacity-80 z-0"></span>
              </Link>
              
              <Link
                to="/about"
                className="group px-10 py-4 bg-transparent border border-cyan-400 rounded-md font-bold text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 hover:border-white hover:text-cyan-400"
              >
                <span className="font-['Orbitron'] text-lg">{t('learnMore')}</span>
              </Link>
            </div>
          </div>

          {/* Animated Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <p className="text-xs text-cyan-400 font-['Orbitron'] mt-2">{language === 'en' ? 'SCROLL DOWN' : 'DÉFILER VERS LE BAS'}</p>
          </div>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-gray-500 via-white to-blue-500 animate-pulse"></div>
      </div>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-gray-500 via-white to-blue-500 opacity-70"></div>
      </div>

      {/* Featured Cars Section */}
      <FeaturedCars featuredCars={featuredCars} />

      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-gray-500 via-white to-blue-500 opacity-70"></div>
      </div>

      {/* Popular Destinations Section */}
      <PopularDestinations destinations={destinations} />

      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-gray-500 via-white to-blue-500 opacity-70"></div>
      </div>

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
       <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-gray-500 via-white to-blue-500 opacity-70"></div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};

export default HomePage;