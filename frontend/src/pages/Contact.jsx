import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { assets } from '../assets/assets';
import '../styles/animations.css';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import FloatingParticles from '../components/Ui/FloatingParticles';
import GlowingGrid from '../components/Ui/GlowingGrid';

const ContactPage = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const contactFormRef = useRef(null);
  const mapSectionRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'General Inquiry'
  });
  
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const subjectOptions = [
    { value: 'General Inquiry', label: language === 'fr' ? 'Renseignement Général' : 'General Inquiry' },
    { value: 'Reservation', label: language === 'fr' ? 'Faire une Réservation' : 'Make a Reservation' },
    { value: 'Support', label: language === 'fr' ? 'Support Client' : 'Customer Support' },
    { value: 'Partnership', label: language === 'fr' ? 'Partenariat Commercial' : 'Business Partnership' }
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '2.75rem',
      minHeight: '2.75rem',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderColor: '#374151',
      borderRadius: '0.375rem',
      fontFamily: 'Orbitron, sans-serif',
      color: 'white',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(6, 182, 212, 1)' : 'none',
      '&:hover': {
        borderColor: '#4B5563',
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'black',
      fontFamily: 'Orbitron, sans-serif',
      maxHeight: '240px',
      overflowY: 'hidden',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '240px',
      overflowY: 'auto',
      paddingRight: '8px',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 255, 255, 0.5) transparent',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'rgba(59, 130, 246, 0.5)' : 'black',
      color: 'white',
      fontFamily: 'Orbitron, sans-serif',
      padding: '4px 8px',
      fontSize: '0.875rem',
      lineHeight: '1.2',
      '&:hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
      fontFamily: 'Orbitron, sans-serif',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#FFFFFF',
      fontFamily: 'Orbitron, sans-serif',
    }),
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate Form Submission
    setSubmitStatus('loading');
    setTimeout(() => {
      setSubmitStatus('success');
      // Reset Form after Success
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: 'General Inquiry'
      });
    }, 1500);
  };
  
  // Contact Information
  const contactInfo = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      title: "Main Office",
      details: "198 Boulevard Mohammed V, Mohammedia, Morocco"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
        </svg>
      ),
      title: "Phone",
      details: "+212 57 77 777"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
        </svg>
      ),
      title: "Email",
      details: "info@rentmyride-morocco.ma"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
        </svg>
      ),
      title: "Hours",
      details: "Open daily: 9:00 AM - 10:00 PM"
    }
  ];
  
  // Locations 
  const locations = [
    { city: "Casablanca", address: "123 Boulevard Mohammed V" },
    { city: "Marrakech", address: "45 Avenue Hassan II" },
    { city: "Rabat", address: "78 Rue des Consuls" },
    { city: "Tangier", address: "90 Boulevard Pasteur" }
  ];

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
          <img 
            src={assets.contact?.heroImage1 || "/api/placeholder/1920/600"} 
            alt="Luxury cars" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <div className="inline-block mb-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-blue-500/20 animate-pulse-slow">
            <span className="text-sm text-cyan-400 font-['Orbitron'] tracking-widest">{t('premiumCarRental')}</span>
          </div>
          <h1 className="text-3xl md:text-6xl uppercase font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white relative">
            {t('contact')}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0"></div>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200 mb-10 relative">
            {language === 'fr' ? 'Prêt à vivre l\'extraordinaire ? Nous sommes là pour vous aider' : 'Ready to experience the extraordinary? We\'re here to assist you'}
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-transparent via-cyan-900/5 to-transparent blur-xl"></div>
          </p>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      </div>
            
      {/* Contact Information */}
      <section ref={contactFormRef} className="py-16 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingGrid containerRef={contactFormRef} />
          <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-cyan-500/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-36 h-36 rounded-full bg-blue-500/5 blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/90 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl mb-8 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-cyan-400 relative">
                {t('getInTouch')}
                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="absolute -z-10 inset-0 bg-gradient-to-br from-transparent via-cyan-900/5 to-transparent blur-xl"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-200 mb-2">{t('fullName')}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-0 h-[2.75rem] bg-black/70 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-200 mb-2">{t('email')}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-0 h-[2.75rem] bg-black/70 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-gray-200 mb-2">{t('phoneNumber')}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-0 h-[2.75rem] bg-black/70 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-200 mb-2">{language === 'fr' ? 'Sujet' : 'Subject'}</label>
                    <Select
                      options={subjectOptions}
                      value={subjectOptions.find(option => option.value === formData.subject)}
                      onChange={(selectedOption) => 
                        setFormData(prevData => ({
                          ...prevData,
                          subject: selectedOption.value
                        }))
                      }
                      styles={customStyles}
                      isSearchable={false}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: 'rgba(59, 130, 246, 0.5)',
                          primary25: 'rgba(59, 130, 246, 0.1)',
                        }
                      })}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-2">{t('message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-black/70 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                    required
                  ></textarea>
                </div>
                
                <div className="mt-8">
                <button
                  type="submit"
                    className={`
                      px-8 py-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white 
                      text-black font-['Orbitron'] rounded-md 
                      shadow-lg hover:shadow-cyan-500/20 
                      transition-all duration-300
                      w-full sm:w-auto
                      relative overflow-hidden group
                      ${submitStatus === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                  disabled={submitStatus === 'loading'}
                >
                    <span className="relative z-10 cursor-pointer">
                      {submitStatus === 'loading' 
                        ? <span className="flex items-center justify-center ">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {language === 'fr' ? 'Envoi en cours...' : 'Sending...'}
                          </span>
                        : t('sendMessage')
                      }
                    </span>
                    <div className="absolute inset-0 w-0 bg-gradient-to-r from-cyan-400 to-white group-hover:w-full transition-all duration-300 -z-5 cursor-pointer"></div>
                </button>
                </div>
                
                {submitStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-900/30 border border-green-500 rounded-lg">
                    <p className="text-green-400">
                      {language === 'fr' 
                        ? 'Votre message a été envoyé avec succès. Notre équipe vous contactera prochainement.' 
                        : 'Your message has been sent successfully. Our team will contact you shortly.'}
                    </p>
                  </div>
                )}
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl mb-8 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-cyan-400 relative">
                {language === 'fr' ? 'Informations de Contact' : 'Contact Information'}
                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-b from-gray-900/60 to-black/60 backdrop-blur-sm p-6 rounded-lg border border-cyan-900/50 shadow-lg relative group overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]"
                  >
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-600/20 to-transparent rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10 group-hover:bg-gradient-to-r group-hover:from-cyan-500/10 group-hover:via-cyan-500/5 group-hover:to-cyan-500/10"></div>
                    
                    {/* Border Accents */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent group-hover:via-cyan-400/60 transition-colors duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent group-hover:via-cyan-400/60 transition-colors duration-500"></div>
                    
                    {/* Corner Accents */}
                    <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-cyan-400/20 opacity-30 group-hover:opacity-100 transition-all duration-500 group-hover:border-cyan-400/50"></div>
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-cyan-400/20 opacity-30 group-hover:opacity-100 transition-all duration-500 group-hover:border-cyan-400/50"></div>
                    
                    <div className="flex items-center mb-3 relative z-10">
                      <span className="mr-3 text-cyan-400">{info.icon}</span>
                      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                        {language === 'fr' && info.title === 'Main Office' ? 'Bureau Principal' : 
                          language === 'fr' && info.title === 'Phone' ? 'Téléphone' : 
                          language === 'fr' && info.title === 'Email' ? 'Email' : 
                          language === 'fr' && info.title === 'Hours' ? 'Horaires' : 
                          info.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 relative z-10">{info.details}</p>
                  </div>
                ))}
              </div>
              
              <h3 className="text-2xl mt-12 mb-6 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-cyan-400 relative">
                {t('locations')}
                <div className="absolute -bottom-2 left-0 w-16 h-px bg-gradient-to-r from-cyan-500 to-transparent"></div>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {locations.map((loc, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-b from-gray-900/40 to-black/20 backdrop-blur-sm p-4 rounded-lg border border-cyan-900/30 relative group overflow-hidden transition-all duration-300 hover:border-cyan-500/50"
                  >
                    {/* Animated Hover Line */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent group-hover:w-full transition-all duration-500"></div>
                    
                    <h4 className="text-lg text-cyan-400 mb-1">{loc.city}</h4>
                    <p className="text-gray-400 text-sm">{loc.address}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12">
                <div className="bg-gradient-to-b from-gray-900/60 to-black/60 backdrop-blur-sm p-6 rounded-lg border border-cyan-900/50 shadow-lg relative group overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-600/10 to-transparent rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                    {language === 'fr' ? 'Heures d\'Ouverture' : 'Opening Hours'}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between relative">
                      <span className="text-gray-400">{language === 'fr' ? 'Lundi - Vendredi' : 'Monday - Friday'}</span>
                      <span className="text-cyan-400 group-hover:text-white transition-colors duration-300">9:00 AM - 10:00 PM</span>
                      <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-px bg-gradient-to-r from-cyan-500/50 to-transparent transition-all duration-700"></div>
                    </div>
                    <div className="flex justify-between relative">
                      <span className="text-gray-400">{language === 'fr' ? 'Samedi' : 'Saturday'}</span>
                      <span className="text-cyan-400 group-hover:text-white transition-colors duration-300">10:00 AM - 8:00 PM</span>
                      <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-px bg-gradient-to-r from-cyan-500/50 to-transparent transition-all duration-700"></div>
                    </div>
                    <div className="flex justify-between relative">
                      <span className="text-gray-400">{language === 'fr' ? 'Dimanche' : 'Sunday'}</span>
                      <span className="text-cyan-400 group-hover:text-white transition-colors duration-300">10:00 AM - 6:00 PM</span>
                      <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-px bg-gradient-to-r from-cyan-500/50 to-transparent transition-all duration-700"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section ref={mapSectionRef} className="py-16 px-4 bg-gradient-to-b from-black/80 via-black/60 to-black/80 backdrop-blur-md relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[url('/patterns/grid-pattern.svg')] bg-center opacity-30"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/40 to-transparent"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>
            <h2 className="text-4xl font-semibold uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
              {language === 'fr' ? 'Trouvez-Nous' : 'Find Us'}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 mx-auto"></div>
            <p className="text-gray-300 max-w-2xl mx-auto mt-4">
              {language === 'fr' 
                ? 'Visitez notre bureau principal à Mohammedia ou l\'une de nos succursales situées dans les principales villes du Maroc.' 
                : 'Visit our main office in Mohammedia or one of our branches located in major cities across Morocco.'}
            </p>
          </div>
          
          {/* Map Placeholder */}
          <div className="relative h-96 rounded-xl overflow-hidden border border-cyan-900/50 shadow-lg group">
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-600/20 to-transparent rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Corner Accents */}
            <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-cyan-400/20 opacity-30 group-hover:opacity-100 transition-all duration-500 group-hover:border-cyan-400/50 z-10"></div>
            <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-cyan-400/20 opacity-30 group-hover:opacity-100 transition-all duration-500 group-hover:border-cyan-400/50 z-10"></div>
            
            <iframe 
              title={language === 'fr' ? 'Carte de localisation Mohammedia' : 'Mohammedia Location Map'}
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54109.88666072956!2d-7.422272027836355!3d33.6835136520606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7b69b2c4ac1c1%3A0xaec39cc99ffeea7c!2sMohammedia%2C%20Morocco!5e0!3m2!1sen!2sus!4v1626517232073!5m2!1sen!2sus"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
      
      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      </div>
      
      {/* Newsletter Signup Section */}
      <section className="mt-24 py-16 px-4 bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-lg relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20 z-0">
          <img 
            src={assets.contact?.stayconnected || "/api/placeholder/1920/600"} 
            alt="Stay Connected" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingParticles count={15} />
          <div className="absolute top-20 left-20 w-48 h-48 rounded-full bg-cyan-500/5 blur-[80px]"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-blue-500/5 blur-[100px]"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/40 to-transparent"></div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="relative mb-8">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>
            <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4">
              {t('stayConnected')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 mx-auto mb-4"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t('newsletterDescription')}
            </p>
          </div>
          
          {/* Newsletter Form */}
          <form className="max-w-md mx-auto flex relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-600/20 to-transparent rounded-md blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-3 bg-black/70 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              required
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-['Orbitron'] rounded-r-md shadow-lg hover:shadow-blue-500/20 transition-all duration-300 relative overflow-hidden group flex items-center justify-center"
            >
              <span className="relative z-10 cursor-pointer">{t('subscribe')}</span>
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-cyan-400 to-white group-hover:w-full transition-all duration-300 -z-5"></div>
            </button>
          </form>
          
          <p className="text-gray-400 text-xs mt-4">
            {t('privacyNotice')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;