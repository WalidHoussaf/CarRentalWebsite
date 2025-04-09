import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import '../styles/animations.css';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import GlowingGrid from '../components/Ui/GlowingGrid';

const AboutPage = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const visionMissionRef = useRef(null);
  const teamSectionRef = useRef(null);
  const storyRef = useRef(null);

  const teamMembers = [
    {
      name: "Walid Houssaf",
      position: t('founderCEO'),
      bio: t('walidBio'),
      image: assets.about?.team?.walid || "/api/placeholder/300/300"
    },
    {
      name: "Zineb El Qodsi",
      position: t('operationsDirector'),
      bio: t('zinebBio'),
      image: assets.about?.team?.zineb || "/api/placeholder/300/300"
    },
    {
      name: "Mia Chen",
      position: t('customerExperience'),
      bio: t('miaBio'),
      image: assets.about?.team?.mia || "/api/placeholder/300/300"
    }
  ];

  // Statistics 
  const stats = [
    { value: "7+", label: t('locations') },
    { value: "100+", label: t('premiumVehicles') },
    { value: "10k+", label: t('happyCustomers') },
    { value: "6", label: t('yearsExperience') }
  ];

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
          <img 
            src={assets.about?.heroImage || "/api/placeholder/1920/600"} 
            alt="Luxury cars" 
            className="w-full h-full object-cover"
          />
        </div>        
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <div className="inline-block mb-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-blue-500/20 animate-pulse-slow">
            <span className="text-sm text-cyan-400 font-['Orbitron'] tracking-widest">{t('premiumCarRental')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white relative">
            {t('aboutUs')}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0"></div>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200 mb-10 relative">
            {t('companyDescription')}
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-transparent via-cyan-900/5 to-transparent blur-xl"></div>
          </p>
          
          <Link
            to="/cars"
            className="px-10 py-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-medium rounded-md transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 font-['Orbitron']"
          >
            {t('exploreOurFleet')}
          </Link>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      </div>
      
      {/* Our Story Section */}
      <section ref={storyRef} className="py-16 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/90 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -z-10 inset-0 bg-gradient-to-br from-transparent via-cyan-900/5 to-transparent blur-xl"></div>
              <h2 className="text-4xl mb-6 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-cyan-400 leading-[1.2] relative">
                {t('ourStory')}
                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
              </h2>
              <p className="text-gray-300 mb-4 text-justify relative z-10">
                {t('foundedText')}
              </p>
              <p className="text-gray-300 mb-4 text-justify">
                {t('evolutionText')}
              </p>
              <p className="text-gray-300 text-justify">
                {t('technologyText')}
              </p>
            </div>
            <div className="relative group">
              <div className="relative h-96 rounded-xl overflow-hidden border border-cyan-900/50 shadow-2xl transition-all duration-500 group-hover:shadow-cyan-700/20">
                <img 
                  src={assets.about?.storyImage || "/api/placeholder/600/400"} 
                  alt="Our journey" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-600/40 to-transparent rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black/80 via-black/60 to-black/80 backdrop-blur-md relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[url('/patterns/grid-pattern.svg')] bg-center opacity-20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/30 to-transparent"></div>
        
        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="text-center mb-12 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-500/10 blur-2xl"></div>
            <h2 className="text-4xl text-center uppercase font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
              {t('ourAccomplishments')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-8 border border-cyan-900/50 rounded-xl bg-gradient-to-b from-gray-900/60 to-black/60 backdrop-blur-sm relative group overflow-hidden will-change-transform transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]"
              >
                {/* Hover effects */}
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-600/40 to-transparent rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="text-4xl md:text-5xl font-bold font-['Orbitron'] mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                  {stat.value}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-16 h-px bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <div className="text-white text-lg md:text-xl font-['Rationale'] group-hover:text-cyan-300 transition-colors duration-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70"></div>
      </div>
      
      {/* Our Vision and Mission */}
      <section ref={visionMissionRef} className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-purple-900/10 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center relative mb-16">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>
            <h2 className="text-4xl text-center font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
              {t('whatWeStandFor')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-b from-gray-900/60 to-black/60 backdrop-blur-md p-8 rounded-xl border border-cyan-800/50 relative group overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]">  
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-600/40 to-transparent rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-2xl mb-4 font-semibold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent relative inline-block">
                  {t('ourVision')}
                  <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-white to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></div>
                </h3>
                <p className="text-gray-300 text-justify">
                  {t('visionText')}
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-gray-900/60 to-black/60 backdrop-blur-md p-8 rounded-xl border border-cyan-800/50 relative group overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]">
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-600/40 to-transparent rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-2xl mb-4 font-semibold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent relative inline-block">
                  {t('ourMission')}
                  <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-white to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></div>
                </h3>
                <p className="text-gray-300 text-justify">
                  {t('missionText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70"></div>
      </div>
      
      {/* Team Section */}
      <section ref={teamSectionRef} className="relative py-16 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <GlowingGrid containerRef={teamSectionRef} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/90 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center relative mb-16">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>
            <h2 className="text-4xl text-center font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
              {t('theHeartOfTheCompany')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-b from-gray-900/40 to-black/20 backdrop-blur-sm border border-cyan-800/30 rounded-lg overflow-hidden group relative h-full transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/0 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10 group-hover:bg-gradient-to-r group-hover:from-white/5 group-hover:via-cyan-400/5 group-hover:to-white/5"></div>
                
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                <div className="p-6 relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <h3 className="text-xl font-semibold mb-1 uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-all duration-300">{member.name}</h3>
                  <p className="text-cyan-400 text-sm mb-3 font-['Orbitron']">{member.position}</p>
                  <p className="text-gray-300 text-sm text-justify">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70"></div>
      </div>
      
      {/* CTA Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
          <img 
            src={assets.about?.ctaBackground || "/api/placeholder/1920/600"} 
            alt="Luxury driving experience" 
            className="w-full h-full object-cover"
          />
        </div>  
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="absolute top-0 left-0 right-0 mx-auto w-auto flex justify-center">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-cyan-500/10 border border-blue-500/20 animate-pulse-slow">
              <span className="text-sm text-cyan-400 font-['Orbitron'] tracking-widest">{t('discoverMore')}</span>
            </div>
          </div>
          <h2 className="mt-12 text-3xl mb-6 text-transparent bg-clip-text bg-gradient-to-r uppercase from-white to-cyan-400 leading-[1.2] relative inline-block">
            {t('readyToExperience')}
            <div className="absolute -bottom-2 left-0 right-0 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto relative">
            {t('fleetReady')}
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-transparent via-cyan-900/5 to-transparent blur-xl"></div>
          </p>
          <Link
            to="/cars"
            className="px-10 py-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-medium rounded-md transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 font-['Orbitron']"
          >
            {t('exploreOurFleet')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;