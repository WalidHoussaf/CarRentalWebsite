import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const footerLinks = [
    {
      title: t('companySection'),
      links: [
        { name: t('cars'), url: '/cars' },
        { name: t('about'), url: '/about' },
        { name: 'Careers', url: '/careers' },
        { name: t('contact'), url: '/contact' }
      ]
    },
    {
      title: t('servicesSection'),
      links: [
        { name: 'Vehicle Rental', url: '/rentals' },
        { name: 'Luxury Experience', url: '/luxury' },
        { name: 'Corporate Solutions', url: '/corporate' },
        { name: 'Long-term Leasing', url: '/leasing' }
      ]
    },
    {
      title: t('supportSection'),
      links: [
        { name: t('faq'), url: '/faq' },
        { name: 'Help Center', url: '/help' },
        { name: t('terms'), url: '/terms' },
        { name: t('privacy'), url: '/privacy' }
      ]
    }
  ];
  
  const socialLinks = [
    { name: 'Twitter', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
      </svg>
    ), url: 'https://twitter.com' },
    { name: 'Instagram', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ), url: 'https://instagram.com' },
    { name: 'Facebook', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    ), url: 'https://facebook.com' },
    { name: 'LinkedIn', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ), url: 'https://linkedin.com' }
  ];

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Top Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-gray-500 via-white to-blue-500 opacity-70"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-white to-cyan-400 rounded opacity-50 blur-sm group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-black px-3 py-2 rounded">
                  <span className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                    RENT MY RIDE
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-400 mb-6 font-['Orbitron'] text-sm">
              {t('experienceFuture')}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center w-10 h-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 text-gray-400 group-hover:text-cyan-800 transition-colors duration-300">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          {/* Links sections */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-600 font-['Orbitron']">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.url}
                      className="text-gray-400 hover:text-cyan-400 text-sm font-['Orbitron'] transition-colors duration-300 flex items-center group"
                    >
                      <div className="w-1 h-1 rounded-full bg-cyan-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Tech Separator */}
        <div className="w-full h-px bg-gradient-to-r from-cyan-600/20 via-white to-cyan-600/20 mb-6"></div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs font-['Orbitron']">
          <div className="mb-4 md:mb-0">
            &copy; {currentYear} RENT MY RIDE. {t('allRightsReserved')}
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="hover:text-cyan-400 transition-colors duration-300">{t('terms')}</Link>
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors duration-300">{t('privacy')}</Link>
            <Link to="/cookies" className="hover:text-cyan-400 transition-colors duration-300">{t('cookies')}</Link>
          </div>
        </div>
      </div>
      
      {/* Animated Circuit Lines */}
      <div className="absolute bottom-0 left-0 w-full h-20 opacity-20 pointer-events-none overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute h-px bg-gradient-to-r from-blue-500/0 via-cyan-500 to-white"
            style={{ 
              width: '100%',
              top: `${i * 5 + 2}px`,
              left: 0,
              animation: `circuitLine ${5 + i * 2}s linear infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Circuit Line Animation */}
      <style>{`
        @keyframes circuitLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;