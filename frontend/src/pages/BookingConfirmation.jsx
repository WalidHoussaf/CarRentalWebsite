import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { assets } from '../assets/assets';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import GlowingGrid from '../components/Ui/GlowingGrid';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// SVG Icons
const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const OptionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const PriceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createBooking } = useBooking();
  const [bookingId, setBookingId] = useState(null);
  const [carImage, setCarImage] = useState(null);
  const { language } = useLanguage();
  const t = useTranslations(language);
  const detailsSectionRef = useRef(null);
  const paymentSectionRef = useRef(null);
  const [bookingCreated, setBookingCreated] = useState(false);
  const hasAttemptedBookingCreation = useRef(false);

  // Get Booking Data from Location State
  const bookingData = location.state || {};
  const { bookingDetails, carDetails } = bookingData;

  // Format date helper
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Available options with pricing
  const availableOptions = [
    { id: 'insurance', name: 'Assurance Premium', price: 45 },
    { id: 'driver', name: 'Chauffeur Professionnel', price: 120 },
    { id: 'gps', name: 'Navigation GPS', price: 15 },
    { id: 'wifi', name: 'Hotspot Wi-Fi Mobile', price: 20 },
    { id: 'child_seat', name: 'Siège Enfant', price: 15 },
    { id: 'roadside_assistance', name: 'Assistance Routière', price: 25 }
  ];

  // Resolve car image
  useEffect(() => {
    if (!carDetails) return;
    
    let image = null;
    
    // Try using car.image as asset reference
    if (carDetails.image && typeof carDetails.image === 'string' && carDetails.image.includes('.')) {
      const parts = carDetails.image.split('.');
      if (parts.length === 2) {
        const category = parts[0];
        const key = parts[1];
        image = assets[category] && assets[category][key];
      }
    }
    
    // Try using car ID
    if (!image && carDetails.id && assets.cars[`car${carDetails.id}`]) {
      image = assets.cars[`car${carDetails.id}`];
    }
    
    // Try using car brand
    if (!image && carDetails.name) {
      const carBrand = carDetails.name.toLowerCase().split(' ')[0];
      
      if (carBrand === 'tesla' && assets.cars.tesla) {
        image = assets.cars.tesla;
      } else if (carBrand === 'bmw' && assets.cars.bmw) {
        image = assets.cars.bmw;
      } else if (carBrand === 'mercedes' && assets.cars.mercedes) {
        image = assets.cars.mercedes;
      }
    }
    
    setCarImage(image);
  }, [carDetails]);

  // Create booking on component mount - but only once when confirmed
  useEffect(() => {
    const createNewBooking = async () => {
      if (!bookingDetails || !carDetails) {
        navigate('/cars');
        return;
      }
      
      // Create a unique identifier for this booking
      const bookingIdentifier = `${carDetails.id}-${bookingDetails.startDate}-${bookingDetails.endDate}`;
      
      // Check if this exact booking has been created during this session
      const existingCreation = sessionStorage.getItem(`booking_created_${bookingIdentifier}`);
      if (existingCreation) {
        const parsedData = JSON.parse(existingCreation);
        setBookingId(parsedData.id);
        setBookingCreated(true);
        return;
      }
      
      // If we already tried to create this booking in this component instance, don't try again
      if (hasAttemptedBookingCreation.current) {
        return;
      }
      
      // Mark that we're attempting to create this booking
      hasAttemptedBookingCreation.current = true;
      
      try {
        setBookingCreated(true); // Set flag to prevent multiple creations
        const result = await createBooking({
          car: carDetails,
          ...bookingDetails,
          confirmationDate: new Date().toISOString()
        });
        
        if (result.success) {
          // Store in sessionStorage to remember we created this booking
          sessionStorage.setItem(`booking_created_${bookingIdentifier}`, JSON.stringify(result.booking));
          
          setBookingId(result.booking.id);
        }
      } catch {
        // Handle error - just mark as not saved to database
      }
    };
    
    createNewBooking();
  }, [bookingDetails, carDetails, createBooking, navigate, bookingCreated]);

  // Handle receipt download
  const handleDownloadReceipt = () => {
    const pdfBookingId = bookingId || 'TEMP-' + Math.floor(Math.random() * 10000);
    
    // Display loading notification
    const loadingNotification = document.createElement('div');
    loadingNotification.style.position = 'fixed';
    loadingNotification.style.bottom = '20px';
    loadingNotification.style.right = '20px';
    loadingNotification.style.background = 'linear-gradient(to right, white, #22d3ee)';
    loadingNotification.style.color = 'black';
    loadingNotification.style.padding = '10px 20px';
    loadingNotification.style.borderRadius = '5px';
    loadingNotification.style.boxShadow = '0 4px 15px rgba(34, 211, 238, 0.3)';
    loadingNotification.style.zIndex = '1000';
    loadingNotification.style.fontFamily = '"Orbitron", sans-serif';
    loadingNotification.style.fontWeight = '500';
    loadingNotification.textContent = t('receiptPreparation');
    document.body.appendChild(loadingNotification);
    
    try {
      // Create a div element for PDF content with a more elaborate style
      const receiptContent = document.createElement('div');
      receiptContent.id = 'pdf-content';
      receiptContent.style.width = '210mm'; 
      receiptContent.style.padding = '0'; 
      receiptContent.style.backgroundColor = 'black';
      receiptContent.style.color = 'white';
      receiptContent.style.fontFamily = '"Orbitron", sans-serif';
      receiptContent.style.position = 'fixed';
      receiptContent.style.top = '0';
      receiptContent.style.left = '0';
      receiptContent.style.zIndex = '-9999';
      receiptContent.style.margin = '0';
      receiptContent.style.boxSizing = 'border-box';
      receiptContent.style.overflow = 'hidden';
      
      // Store local copies to avoid reference issues
      const carName = carDetails?.name || 'Véhicule';
      const carCategory = carDetails?.category || 'Premium';
      const carPrice = carDetails?.price || 0;
      const startDateFormatted = formatDate(bookingDetails?.startDate);
      const endDateFormatted = formatDate(bookingDetails?.endDate);
      const totalDays = bookingDetails?.totalDays || 1;
      const totalPrice = bookingDetails?.totalPrice || 0;
      const pickupLocation = bookingDetails?.pickupLocation?.charAt(0).toUpperCase() + (bookingDetails?.pickupLocation?.slice(1) || '');
      const dropoffLocation = bookingDetails?.dropoffLocation?.charAt(0).toUpperCase() + (bookingDetails?.dropoffLocation?.slice(1) || '');
      const hasOptions = bookingDetails?.options && bookingDetails.options.length > 0;
      const optionsPrice = hasOptions ? totalPrice - (carPrice * totalDays) : 0;
      
      // Determine which options have been selected
      const selectedOptions = bookingDetails?.options?.map(optionId => {
        return availableOptions.find(opt => opt.id === optionId);
      }).filter(Boolean) || [];
      
      // Create the receipt content 
      receiptContent.innerHTML = `
        <div style="border: 1px solid #0e7490; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(8, 145, 178, 0.2); max-width: 100%; margin: 0 auto; background-color: #0f172a;">
          <!-- Header -->
          <div style="background: linear-gradient(to right, #0e7490, #1e40af); color: white; padding: 15px; position: relative; overflow: hidden; display: flex; justify-content: space-between; align-items: center;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg=='); opacity: 0.2;"></div>
            
            <!-- Logo and info to the left -->
            <div style="position: relative; z-index: 1;">
              <h1 style="font-size: 24px; margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: white; text-shadow: 0 0 5px rgba(34, 211, 238, 0.7);">RENT MY RIDE</h1>
              <p style="margin: 2px 0 0; font-size: 14px; opacity: 0.9;">${language === 'fr' ? 'Location de Voitures Premium' : 'Premium Car Rental'}</p>
            </div>
            
            <!-- Contact info to the right -->
            <div style="text-align: right; font-size: 12px; position: relative; z-index: 1;">
              <p style="margin: 0; opacity: 0.8;">www.rentmyride-morocco.ma</p>
              <p style="margin: 0; opacity: 0.8;">info@rentmyride-morocco.ma</p>
              <p style="margin: 0; opacity: 0.8;">+212 57 77 777</p>
            </div>
          </div>
          
          <!-- Receipt title -->
          <div style="background-color: #1e293b; padding: 10px; border-bottom: 1px solid #334155; text-align: center;">
            <h2 style="margin: 0; font-size: 16px; font-weight: 600; color: #22d3ee; text-shadow: 0 0 8px rgba(34, 211, 238, 0.5);">${language === 'fr' ? 'CONFIRMATION DE RÉSERVATION' : 'BOOKING CONFIRMATION'}</h2>
          </div>
          
          <!-- Reservation information -->
          <div style="padding: 15px; background: #0f172a;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <div>
                <p style="margin: 0 0 3px; color: #94a3b8; font-size: 12px;">${language === 'fr' ? 'Numéro de réservation' : 'Booking Number'}</p>
                <p style="margin: 0; color: #22d3ee; font-size: 14px; font-weight: 600;">#${pdfBookingId}</p>
              </div>
              <div>
                <p style="margin: 0 0 3px; color: #94a3b8; font-size: 12px;">${language === 'fr' ? 'Date d\'émission' : 'Issue Date'}</p>
                <p style="margin: 0; color: #f8fafc; font-size: 14px;">${new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
            
            <!-- Vehicle details -->
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #334155;">
              <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: #22d3ee;">${language === 'fr' ? 'Détails du Véhicule' : 'Vehicle Details'}</h3>
              <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px; display: flex; align-items: center;">
                <div style="font-size: 20px; color: #22d3ee; margin-right: 10px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: #22d3ee;">
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                    <circle cx="6.5" cy="16.5" r="2.5"/>
                    <circle cx="16.5" cy="16.5" r="2.5"/>
                    <path d="M5 11l1.5-3h9l1 3"/>
                    <path d="M7 10.7v-.8a.9.9 0 0 1 .9-.9h.8a.9.9 0 0 1 .9.9v.8a.9.9 0 0 1-.9.9h-.8a.9.9 0 0 1-.9-.9Z"/>
                    <path d="M14 10.7v-.8a.9.9 0 0 1 .9-.9h.8a.9.9 0 0 1 .9.9v.8a.9.9 0 0 1-.9.9h-.8a.9.9 0 0 1-.9-.9Z"/>
                    <path d="M2 12h4"/>
                    <path d="M18 12h4"/>
                  </svg>
                </div>
                <div>
                  <p style="margin: 0 0 3px; color: #f8fafc; font-size: 16px; font-weight: 600;">${carName}</p>
                  <p style="margin: 0; color: #94a3b8; font-size: 14px;">${carCategory}</p>
                </div>
              </div>
            </div>
            
            <!-- Rental details -->
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #334155;">
              <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: #22d3ee;">${language === 'fr' ? 'Détails de la Location' : 'Rental Details'}</h3>
              
              <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                <div style="flex: 1; min-width: 45%;">
                  <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px;">
                    <p style="margin: 0 0 3px; color: #94a3b8; font-size: 12px;">${language === 'fr' ? 'Période de Location' : 'Rental Period'}</p>
                    <p style="margin: 0 0 5px; color: #f8fafc; font-size: 14px; font-weight: 600;">
                      ${startDateFormatted} → ${endDateFormatted}
                    </p>
                    <p style="margin: 0; padding: 3px 6px; background-color: #0c4a6e; color: #67e8f9; border-radius: 4px; display: flex; align-items: center; justify-content: center; min-height: 24px; font-size: 12px; text-align: center;">
                      ${totalDays} ${language === 'fr' ? 'jours' : 'days'}
                    </p>
                  </div>
                </div>
                
                <div style="flex: 1; min-width: 45%;">
                  <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 10px;">
                    <p style="margin: 0 0 3px; color: #94a3b8; font-size: 12px;">${language === 'fr' ? 'Lieux' : 'Locations'}</p>
                    <p style="margin: 0 0 3px; color: #f8fafc; font-size: 14px;">
                      <span style="font-weight: 600;">${language === 'fr' ? 'Départ' : 'Pickup'}:</span> ${pickupLocation}
                    </p>
                    <p style="margin: 0; color: #f8fafc; font-size: 14px;">
                      <span style="font-weight: 600;">${language === 'fr' ? 'Retour' : 'Return'}:</span> ${dropoffLocation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Selected options -->
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #334155;">
              <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: #22d3ee;">${language === 'fr' ? 'Options Sélectionnées' : 'Selected Options'}</h3>
              
              ${selectedOptions.length > 0 
                ? `<table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead>
                      <tr style="background-color: #1e293b;">
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #334155; font-weight: 600; color: #cbd5e1;">${language === 'fr' ? 'Description' : 'Description'}</th>
                        <th style="text-align: right; padding: 8px; border-bottom: 1px solid #334155; font-weight: 600; color: #cbd5e1;">${language === 'fr' ? 'Prix' : 'Price'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${selectedOptions.map(option => `
                        <tr>
                          <td style="padding: 8px; border-bottom: 1px solid #334155; color: #f8fafc;">${language === 'fr' ? option.name : option.id ? t('option_' + option.id) : option.name}</td>
                          <td style="text-align: right; padding: 8px; border-bottom: 1px solid #334155; color: #22d3ee;">$${option.price}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>`
                : `<div style="text-align: center; padding: 12px; background-color: #1e293b; border: 1px dashed #334155; border-radius: 8px; color: #94a3b8; font-size: 13px;">
                    ${language === 'fr' ? 'Aucune option sélectionnée' : 'No options selected'}
                  </div>`
              }
            </div>
            
            <!-- Payment summary -->
            <div>
              <h3 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: #22d3ee;">${language === 'fr' ? 'Résumé du Paiement' : 'Payment Summary'}</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tbody>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #334155; color: #cbd5e1;">${language === 'fr' ? 'Location du véhicule' : 'Vehicle Rental'}</td>
                    <td style="text-align: right; padding: 8px; border-bottom: 1px solid #334155; color: #f8fafc;">$${carPrice} × ${totalDays} ${language === 'fr' ? 'jours' : 'days'}</td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #334155; color: #cbd5e1;">${language === 'fr' ? 'Sous-total' : 'Subtotal'}</td>
                    <td style="text-align: right; padding: 8px; border-bottom: 1px solid #334155; color: #f8fafc;">$${carPrice * totalDays}</td>
                  </tr>
                  
                  ${hasOptions ? `
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #334155; color: #cbd5e1;">${language === 'fr' ? 'Options additionnelles' : 'Additional Options'}</td>
                      <td style="text-align: right; padding: 8px; border-bottom: 1px solid #334155; color: #f8fafc;">$${optionsPrice}</td>
                    </tr>
                  ` : ''}
                  
                  <tr style="background-color: #0f172a;">
                    <td style="padding: 10px 8px; font-weight: 600; color: #f8fafc; font-size: 15px;">${language === 'fr' ? 'Total' : 'Total'}</td>
                    <td style="text-align: right; padding: 10px 8px; font-weight: 700; font-size: 15px; color: #22d3ee;">$${totalPrice}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="padding: 12px; background-color: #1e293b; text-align: center; border-top: 1px solid #334155; font-size: 12px;">
            <p style="margin: 0 0 5px; color: #cbd5e1;">${language === 'fr' ? 'Merci d\'avoir choisi Rent My Ride pour votre location de véhicule.' : 'Thank you for choosing Rent My Ride for your vehicle rental.'}</p>
            <p style="margin: 0; color: #94a3b8;">© ${new Date().getFullYear()} Rent My Ride. ${language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
          </div>
        </div>
      `;
      
      // Add styles to ensure that all PDF has a black background
      const style = document.createElement('style');
      style.textContent = `
        @page {
          margin: 0;
          padding: 0;
          background-color: black;
        }
        body {
          background-color: black;
          margin: 0;
          padding: 0;
        }
        #pdf-content {
          background-color: black;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow: hidden;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      `;
      document.head.appendChild(style);

      // Add to document
      document.body.appendChild(receiptContent);
      
      const orbitronFont = document.createElement('link');
      orbitronFont.rel = 'stylesheet';
      orbitronFont.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap';
      document.head.appendChild(orbitronFont);
      
      // Delay for letting content render correctly
      setTimeout(() => {
        const containerBackground = document.createElement('div');
        containerBackground.style.position = 'fixed';
        containerBackground.style.top = '0';
        containerBackground.style.left = '0';
        containerBackground.style.width = '100%';
        containerBackground.style.height = '100%';
        containerBackground.style.backgroundColor = 'black';
        containerBackground.style.zIndex = '-10000';
        document.body.appendChild(containerBackground);
        
        html2canvas(receiptContent, {
          scale: 2, 
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#000000', 
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight,
          x: 0,
          y: 0
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
            background: 'black'
          });
          
          pdf.setFillColor(0, 0, 0);
          pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
          
          const pageWidth = pdf.internal.pageSize.getWidth();
          
          const contentRatio = canvas.height / canvas.width;
          const imgWidth = pageWidth;
          const imgHeight = imgWidth * contentRatio;
          
          pdf.addImage(imgData, 'JPEG', 0, 6, imgWidth, imgHeight); 
          
          // Save the PDF
          pdf.save(`recu-reservation-${pdfBookingId}.pdf`);
          
          // Clean up elements
          document.body.removeChild(containerBackground);
          cleanupAfterPDFGeneration(receiptContent, loadingNotification, true, orbitronFont);
        }).catch(error => {
          console.error('Error generating canvas:', error);
          handlePDFError(loadingNotification, orbitronFont);
        });
      }, 1000);
    } catch (error) {
      console.error('Error preparing PDF:', error);
      handlePDFError(loadingNotification);
    }
  };
  
  // Function to handle PDF errors
  const handlePDFError = (loadingNotification, fontElement = null) => {
    // Remove loading notification
    if (document.body.contains(loadingNotification)) {
      document.body.removeChild(loadingNotification);
    }
    
    // Remove font element if added
    if (fontElement && document.head.contains(fontElement)) {
      document.head.removeChild(fontElement);
    }
    
    // Display error notification with improved style
    const errorNotification = document.createElement('div');
    errorNotification.style.position = 'fixed';
    errorNotification.style.bottom = '20px';
    errorNotification.style.right = '20px';
    errorNotification.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
    errorNotification.style.color = 'white';
    errorNotification.style.padding = '10px 20px';
    errorNotification.style.borderRadius = '5px';
    errorNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    errorNotification.style.zIndex = '1000';
    errorNotification.style.fontFamily = '"Orbitron", sans-serif';
    errorNotification.textContent = t('receiptError');
    
    document.body.appendChild(errorNotification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      if (document.body.contains(errorNotification)) {
        document.body.removeChild(errorNotification);
      }
    }, 3000);
    
    // Clean up all remaining PDF elements
    const pdfContent = document.getElementById('pdf-content');
    if (pdfContent && document.body.contains(pdfContent)) {
      document.body.removeChild(pdfContent);
    }
  };
  
  // Function to clean up after PDF generation
  const cleanupAfterPDFGeneration = (element, loadingNotification, success, fontElement = null) => {
    // Remove PDF content element
    if (element && document.body.contains(element)) {
      document.body.removeChild(element);
    }
    
    // Remove loading notification
    if (document.body.contains(loadingNotification)) {
      document.body.removeChild(loadingNotification);
    }
    
    // Remove font element if added
    if (fontElement && document.head.contains(fontElement)) {
      document.head.removeChild(fontElement);
    }
    
    if (success) {
      // Display success notification 
      const successNotification = document.createElement('div');
      successNotification.style.position = 'fixed';
      successNotification.style.bottom = '20px';
      successNotification.style.right = '20px';
      successNotification.style.background = 'linear-gradient(to right, white, #22d3ee)';
      successNotification.style.color = 'black';
      successNotification.style.padding = '10px 20px';
      successNotification.style.borderRadius = '5px';
      successNotification.style.boxShadow = '0 4px 15px rgba(34, 211, 238, 0.3)';
      successNotification.style.zIndex = '1000';
      successNotification.style.fontFamily = '"Orbitron", sans-serif';
      successNotification.style.fontWeight = '500';
      successNotification.textContent = t('receiptDownloaded');
      
      document.body.appendChild(successNotification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        if (document.body.contains(successNotification)) {
          document.body.removeChild(successNotification);
        }
      }, 3000);
    }
  };

  // Handle click on explore more button
  const handleExploreMore = () => {
    // Force navigation with page refresh
    window.location.href = '/cars';
  };

  // If no booking data, return to vehicles page
  if (!bookingDetails || !carDetails) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 font-['Orbitron'] relative">
      {/* Hero Section */}
      <div className="w-full py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90 z-0"></div>
        <div className="absolute inset-0 opacity-10 z-0 bg-[url('/patterns/grid-pattern.svg')] bg-center"></div>
        
        {/* Static light effects */}
        <div className="absolute inset-0 pointer-events-none z-100">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-[80px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-cyan-400 mb-6 relative overflow-hidden group animate-pulse-slow">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <SuccessIcon />
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white mb-4 relative leading-[1.2]">
              {t('bookingConfirmed')}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0"></div>
            </h1>
            <br></br>
            <p className="text-cyan-300 text-lg mb-2 relative">
              {t('thankYouForBooking')}
              <div className="absolute -z-10 inset-0 bg-gradient-to-r from-transparent via-cyan-900/5 to-transparent blur-xl"></div>
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              {t('bookingSuccessDescription')}
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleDownloadReceipt}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 transform hover:scale-105 relative overflow-hidden group cursor-pointer"
              >
                <span className="relative z-10 flex items-center">
                  <DownloadIcon />
                  <span className="ml-2">{t('downloadReceipt')}</span>
                </span>
                <div className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300 -z-5"></div>
              </button>
              
              <button 
                onClick={handleExploreMore}
                className="px-6 py-3 bg-transparent border border-cyan-500/30 text-cyan-400 rounded-lg flex items-center justify-center hover:bg-cyan-900/10 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                {t('exploreMoreVehicles')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      </div>

      {/* Booking Details Section */}
      <div ref={detailsSectionRef} className="py-16 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingGrid containerRef={detailsSectionRef} />
          <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-cyan-500/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-36 h-36 rounded-full bg-blue-500/5 blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/90 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Section title */}
          <div className="text-center mb-12">
            <div className="relative">
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>
              <h2 className="text-4xl font-semibold text-transparent uppercase bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4">
                {t('bookingDetails')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 mx-auto mb-4"></div>
            </div>
          </div>
          
          {/* Car information card */}
          <div className="mb-12 bg-gradient-to-b from-gray-900/60 to-black/60 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.1)] border border-cyan-900/30 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 transform hover:scale-[1.01] group">
            <div className="flex flex-col md:flex-row">
              {/* Car image */}
              <div className="md:w-2/5 relative overflow-hidden">
                {carImage ? (
                  <img 
                    src={carImage} 
                    alt={carDetails.name}
                    className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/400x300/0f172a/22d3ee?text=${encodeURIComponent(carDetails.name)}`;
                    }}
                  />
                ) : (
                  <div className="w-full h-64 md:h-full bg-blue-900/20 flex items-center justify-center">
                    <p className="text-cyan-400 text-xl">{carDetails.name}</p>
                  </div>
                )}
                <div className="absolute top-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-br-lg text-sm font-medium">
                  {carDetails.category}
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Car details */}
              <div className="md:w-3/5 p-8 relative">
                
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4">
                  {carDetails.name}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {carDetails.features && carDetails.features.slice(0, 4).map((feature, index) => (
                    <span 
                      key={index} 
                      className="text-xs px-3 py-1 rounded-full bg-cyan-900/20 text-cyan-400 border border-cyan-900/50 transition-all duration-300 hover:bg-cyan-900/30 hover:border-cyan-500/60"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="space-y-5">
                  {/* Rental period */}
                  <div className="flex items-start group">
                    <div className="w-10 h-10 rounded-full bg-cyan-900/20 flex items-center justify-center text-cyan-400 mr-4 mt-1 transition-all duration-300 group-hover:bg-cyan-900/40">
                      <CalendarIcon />
                    </div>
                    <div>
                      <h3 className="text-cyan-400 text-sm mb-1 group-hover:text-cyan-300 transition-colors duration-300">{t('rentalPeriodTitle')}</h3>
                      <p className="text-white font-medium">
                        {formatDate(bookingDetails.startDate)} - {formatDate(bookingDetails.endDate)}
                      </p>
                      <p className="text-gray-400 text-sm">{bookingDetails.totalDays} {t('days')}</p>
                    </div>
                  </div>
                  
                  {/* Locations */}
                  <div className="flex items-start group">
                    <div className="w-10 h-10 rounded-full bg-purple-900/20 flex items-center justify-center text-purple-400 mr-4 mt-1 transition-all duration-300 group-hover:bg-purple-900/40">
                      <LocationIcon />
                    </div>
                    <div>
                      <h3 className="text-purple-400 text-sm mb-1 group-hover:text-purple-300 transition-colors duration-300">{t('locationsTitle')}</h3>
                      <p className="text-white font-medium">
                        {t('pickupLabel')}: {bookingDetails.pickupLocation?.charAt(0).toUpperCase() + bookingDetails.pickupLocation?.slice(1)}
                      </p>
                      <p className="text-white font-medium">
                        {t('returnLabel')}: {bookingDetails.dropoffLocation?.charAt(0).toUpperCase() + bookingDetails.dropoffLocation?.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Options */}
            <div className="p-8 bg-gradient-to-b from-gray-900/60 to-black/60 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.1)] border border-cyan-900/30 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 transform hover:scale-[1.02] relative group">
              
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400 mr-4 transition-all duration-300 group-hover:bg-blue-900/40">
                  <OptionsIcon />
                </div>
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
                  {t('optionsTitle')}
                </h3>
              </div>
              
              <div className="space-y-4">
                {bookingDetails.options && bookingDetails.options.length > 0 ? (
                  bookingDetails.options.map(optionId => {
                    const option = availableOptions.find(opt => opt.id === optionId);
                    return option ? (
                      <div key={optionId} className="flex justify-between items-center border-b border-blue-900/30 pb-3 group/item hover:border-blue-500/50 transition-colors duration-300">
                        <span className="text-white group-hover/item:text-cyan-100 transition-colors duration-300">{option.name}</span>
                        <span className="text-cyan-400 font-medium group-hover/item:text-cyan-300 transition-colors duration-300">${option.price}</span>
                      </div>
                    ) : null;
                  })
                ) : (
                  <div className="flex items-center justify-center h-32 border border-dashed border-blue-900/40 rounded-lg">
                    <p className="text-gray-400 italic">{t('noOptionsSelected')}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Payment summary */}
            <div ref={paymentSectionRef} className="p-8 bg-gradient-to-b from-gray-900/60 to-black/60 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.1)] border border-cyan-900/30 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 transform hover:scale-[1.02] relative group">
              
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-green-900/20 flex items-center justify-center text-green-400 mr-4 transition-all duration-300 group-hover:bg-green-900/40">
                  <PriceIcon />
                </div>
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400">
                  {t('paymentSummaryTitle')}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-blue-900/30 pb-3 group/item hover:border-green-500/50 transition-colors duration-300">
                  <span className="text-white group-hover/item:text-green-100 transition-colors duration-300">{t('vehicleRental')}</span>
                  <span className="text-cyan-400 font-medium group-hover/item:text-green-300 transition-colors duration-300">
                    ${carDetails.price} × {bookingDetails.totalDays} {t('days')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-b border-blue-900/30 pb-3 group/item hover:border-green-500/50 transition-colors duration-300">
                  <span className="text-white group-hover/item:text-green-100 transition-colors duration-300">{t('subtotal')}</span>
                  <span className="text-cyan-400 font-medium group-hover/item:text-green-300 transition-colors duration-300">
                    ${carDetails.price * bookingDetails.totalDays}
                  </span>
                </div>
                
                {/* Calculate option cost */}
                {bookingDetails.options && bookingDetails.options.length > 0 && (
                  <div className="flex justify-between items-center border-b border-blue-900/30 pb-3 group/item hover:border-green-500/50 transition-colors duration-300">
                    <span className="text-white group-hover/item:text-green-100 transition-colors duration-300">{t('additionalOptions')}</span>
                    <span className="text-cyan-400 font-medium group-hover/item:text-green-300 transition-colors duration-300">
                      ${bookingDetails.totalPrice - (carDetails.price * bookingDetails.totalDays)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3 bg-gradient-to-r from-transparent via-green-900/10 to-transparent p-3 rounded-lg">
                  <span className="text-white text-lg">{t('total')}</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400">
                    ${bookingDetails.totalPrice}
                  </span>
                </div>
                
                {/* Payment Method Information */}
                {bookingDetails?.payment && (
                  <div className="mt-5 bg-black/30 backdrop-blur-sm rounded-lg border border-green-900/20 p-3">
                    <h4 className="text-green-400 text-xs font-['Orbitron'] mb-2 flex items-center">
                      <div className="w-1 h-1 bg-green-400 rounded-full mr-2"></div>
                      {t('paymentMethod')}
                    </h4>
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        {bookingDetails.payment.payment_method === 'paypal' ? (
                          <div className="flex items-center gap-1">
                            <div className="flex bg-[#253b80] text-white text-xs px-1 rounded-l">Pay</div>
                            <div className="flex bg-[#179bd7] text-white text-xs px-1 rounded-r">Pal</div>
                          </div>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h.01M11 15h2" />
                            <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth={1.5} />
                          </svg>
                        )}
                        <span className="ml-2 text-white font-['Orbitron'] text-sm">
                          {bookingDetails.payment.payment_method === 'paypal' ? 'PayPal' : t('creditCard')}
                        </span>
                      </div>
                    </div>
                    {bookingDetails.payment.payment_id && (
                      <div className="text-xs text-gray-400 mt-1 font-['Rationale']">
                        {t('transactionID')}: <span className="text-gray-300">{bookingDetails.payment.payment_id}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      </div>
      
      {/* CTA Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
          <img 
            src={assets.faq?.ctaBackground2 || "/api/placeholder/1920/600"} 
            alt="Luxury driving experience" 
            className="w-full h-full object-cover"
          />
          
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]"></div>
          </div>
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h2 className="text-3xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white relative inline-block">
            {t('readyToExperienceLuxury')}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0"></div>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {language === 'fr' 
              ? "Parcourez notre flotte premium et réservez votre prochain voyage extraordinaire à travers le Maroc." 
              : "Browse our premium fleet and book your next extraordinary journey through Morocco."}
          </p>
          <Link
            to="/cars"
            className="inline-block px-10 py-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-medium rounded-md shadow-lg hover:shadow-cyan-500/20 transform transition-all duration-300 hover:scale-105 relative overflow-hidden group"
          >
            <span className="relative z-10">{t('browseOurFleet')}</span>
            <div className="absolute inset-0 w-0 bg-gradient-to-r from-cyan-400 to-white group-hover:w-full transition-all duration-300 -z-5"></div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BookingConfirmation; 