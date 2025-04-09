import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize, ZoomIn, ZoomOut, Download, Heart, Share2 } from 'lucide-react';
import { useLanguage } from '../../../../context/LanguageContext';
import { useTranslations } from '../../../../translations';

const GalleryTab = ({ car }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // State to track the currently displayed main image
  const [selectedImage, setSelectedImage] = useState(0);
  // State to track if the full-size image modal is open
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State for image zoom level in modal
  const [zoomLevel, setZoomLevel] = useState(1);
  // State for image position when zoomed
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  // State to track if autoplay is on
  const [isAutoplayOn, setIsAutoplayOn] = useState(true);
  // State to track favorites
  const [favorites, setFavorites] = useState([]);
  
  // Check if car has gallery property and that it contains valid images
  const hasGallery = car && car.gallery && Array.isArray(car.gallery) && car.gallery.length > 0;
  
  // Create a combined array of images starting with the main car image
  const allImages = useMemo(() => {
    return hasGallery 
      ? [{ path: car.image, alt: `${car.name} main view` }, ...car.gallery]
      : car?.image ? [{ path: car.image, alt: `${car.name} main view` }] : [];
  }, [hasGallery, car?.image, car?.gallery, car?.name]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(`gallery-favorites-${car?.id}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, [car?.id]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (car?.id && favorites.length > 0) {
      localStorage.setItem(`gallery-favorites-${car?.id}`, JSON.stringify(favorites));
    }
  }, [favorites, car?.id]);

  // Auto-rotate images every 5 seconds (only when modal is closed and autoplay is on)
  useEffect(() => {
    if (allImages.length <= 1 || isModalOpen || !isAutoplayOn) return;
    
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [allImages, isModalOpen, isAutoplayOn]);

  // Reset zoom when changing images
  useEffect(() => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, [selectedImage]);

  // Keyboard navigation for modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          closeModal();
          break;
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedImage]);

  // Function to handle thumbnail click
  const handleThumbnailClick = useCallback((index) => {
    setSelectedImage(index);
  }, []);

  // Function to open modal with full-size image
  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setIsAutoplayOn(false); // Pause autoplay when modal opens
  }, []);

  // Function to close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    setIsAutoplayOn(true); // Resume autoplay when modal closes
  }, []);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const goToNext = useCallback(() => {
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    if (zoomLevel < 3) {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
    }
  }, [zoomLevel]);

  const handleZoomOut = useCallback(() => {
    if (zoomLevel > 1) {
      setZoomLevel(prev => Math.max(prev - 0.25, 1));
    }
  }, [zoomLevel]);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  // Handle mouse movement for panning when zoomed
  const handleMouseMove = useCallback((e) => {
    if (zoomLevel <= 1) return;
    
    // Only move the image if mouse button is pressed
    if (e.buttons === 1) {
      setImagePosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  }, [zoomLevel]);

  // Toggle favorite status - Fixed to properly stop event propagation
  const toggleFavorite = useCallback((index, e) => {
    // Always stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setFavorites(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  }, []);

  // Function to handle image sharing - Fixed to properly stop event propagation
  const handleShare = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (navigator.share) {
      navigator.share({
        title: `${car?.name || 'Amazing vehicle'} - Gallery`,
        text: `Check out this ${car?.name || 'amazing vehicle'}!`,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing', error));
    } else {
      // Fallback - copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Could not copy text: ', err));
    }
  }, [car?.name]);

  // Function to handle image download 
  const handleDownload = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const link = document.createElement('a');
    link.href = allImages[selectedImage].path;
    link.download = `${car?.name || 'vehicle'}-image-${selectedImage}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [allImages, selectedImage, car?.name]);

  // Function to handle modal background click
  const handleModalBackgroundClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, [closeModal]);

  // Function to handle featured image click
  const handleFeatureClick = useCallback((e) => {
    e.stopPropagation();
    openModal();
  }, [openModal]);

  // Function to handle thumbanil image click
  const handleThumbImageClick = useCallback((index, e) => {
    e.stopPropagation();
    setSelectedImage(index);
    openModal();
  }, [openModal]);

  return (
    <div className="transition-all duration-500 relative overflow-hidden rounded-xl p-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-black to-gray-900/60 z-0"></div>
      
      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 opacity-20 z-0">
        <div className="absolute inset-0 bg-grid-scan"></div>
      </div>
      
      {/* Animated Glow Elements */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-2xl z-0 floating-light"></div>
      <div className="absolute bottom-0 left-32 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-2xl z-0 floating-light-slow"></div>
      
      {/* Tech Circuit Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-20 bg-tech-lines z-0"></div>
      <div className="absolute top-16 right-0 w-32 h-full opacity-15 bg-data-stream z-0"></div>
      
      {/* Content Container */}
      <div className="relative z-10">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white font-['Orbitron'] mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            {t('mediaGallery')}
              </span>
            </h2>
            <p className="text-2xs text-blue-200 font-['Orbitron']">
              {t('exploreDetails')}
            </p>
          </div>
          
          {/* Gallery Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAutoplayOn(prev => !prev)}
              className={`px-2 py-1 rounded text-xs font-['Orbitron'] transition-all ${
                isAutoplayOn 
                  ? 'bg-gradient-to-r from-white to-cyan-400 text-black shadow-md shadow-blue-500/20 cursor-pointer' 
                  : 'bg-gray-800/70 backdrop-blur-sm text-cyan-400 hover:bg-gray-700 hover:text-white cursor-pointer'
              }`}
              type="button"
            >
              {isAutoplayOn ? t('autoplayOn') : t('autoplayOff')}
            </button>
          </div>
        </div>
       
        {/* Horizontal Gallery Layout */}
        <div className="grid grid-cols-3 gap-3">
          {/* Featured Image */}
          <div 
            className="
              col-span-1 relative overflow-hidden rounded-md 
              border border-blue-900/80 
              bg-black/60 backdrop-blur-md
              w-full aspect-[4/3]
              shadow-lg shadow-blue-500/20
              cursor-pointer
              hover:border-blue-500/50 transition-all duration-300
              group
              before:content-[''] before:absolute before:border-t before:border-l before:border-blue-500/30 before:rounded-md
              after:content-[''] after:absolute before:inset-0 after:border-b after:border-r after:border-blue-500/30 after:rounded-md
            "
            onClick={handleFeatureClick}
          >
            {allImages.length > 0 ? (
              <>
                <img
                  src={allImages[0].path}
                  alt={allImages[0].alt}
                  className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm text-white p-2 font-['Orbitron'] text-xl">
                  {car.name || "Featured"}
                </div>
                <button 
                  className="absolute right-2 top-2 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black p-1 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-blue-500/30 text-center cursor-pointer"
                  onClick={handleFeatureClick}
                  type="button"
                >
                  <span className="text-xs font-['Orbitron'] px-2 text-center">{t('showMore')}</span>
                </button>
                
                {/* Favorite Button */}
                <button 
                  onClick={(e) => toggleFavorite(0, e)}
                  className="absolute left-2 top-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
                  type="button"
                >
                  <Heart size={16} className={favorites.includes(0) ? 'fill-red-500 text-red-500' : ''} />
                </button>
              </>
            ) : (
              <img
                src={car.image || "/api/placeholder/800/600"}
                alt={car.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Additional Images */}
          {allImages.slice(1, 3).map((image, index) => (
            <div
              key={`featured-${index + 1}`}
              className="
                col-span-1 relative overflow-hidden rounded-md 
                border border-blue-900/80 
                bg-black/60 backdrop-blur-md
                w-full aspect-[4/3]
                shadow-lg shadow-blue-500/20
                cursor-pointer
                hover:border-blue-500/50 transition-all duration-300
                group
                before:content-[''] before:absolute before:border-t before:border-l before:border-blue-500/30 before:rounded-md
                after:content-[''] after:absolute before:inset-0 after:border-b after:border-r after:border-blue-500/30 after:rounded-md
              "
              onClick={(e) => handleThumbImageClick(index + 1, e)}
            >
              <img
                src={image.path}
                alt={image.alt}
                className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
              />
              
              {/* Favorite Button */}
              <button 
                onClick={(e) => toggleFavorite(index + 1, e)}
                className="absolute left-2 top-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
                type="button"
              >
                <Heart size={16} className={favorites.includes(index + 1) ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </div>
          ))}

          {/* Fill in with placeholders if needed */}
          {allImages.length < 3 && 
            Array(3 - allImages.length).fill(0).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="
                  col-span-1 relative overflow-hidden rounded-md 
                  border border-blue-900/50 
                  bg-black/60 backdrop-blur-md
                  w-full aspect-[4/3]
                  shadow-lg shadow-blue-500/10
                "
              >
                <img
                  src="/api/placeholder/800/600"
                  alt="Gallery placeholder"
                  className="w-full h-full object-cover opacity-30"
                />
              </div>
            ))
          }
        </div>
      </div>

      {/* Full-Size Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={handleModalBackgroundClick}
        >
          <div 
            className="
              relative w-full max-w-5xl max-h-[80vh]
              bg-black/80 backdrop-blur-md
              border border-blue-900/80
              rounded-lg
              shadow-lg shadow-blue-500/20
              overflow-hidden
              before:content-[''] before:absolute before:border-t before:border-l before:border-blue-500/30 before:rounded-lg
              after:content-[''] after:absolute before:inset-0 after:border-b after:border-r after:border-blue-500/30 after:rounded-lg
            "
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Image Container */}
            <div 
              className="w-full h-full flex items-center justify-center p-4 overflow-hidden"
              onMouseMove={handleMouseMove}
              style={{ cursor: zoomLevel > 1 ? 'grab' : 'default' }}
            >
              <div
                className="relative transition-transform duration-200"
                style={{ 
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  transition: zoomLevel === 1 ? 'transform 0.2s ease-out' : 'none'
                }}
              >
                <img
                  src={allImages[selectedImage].path}
                  alt={allImages[selectedImage].alt}
                  className="max-w-full max-h-[70vh] object-contain"
                  draggable="false"
                />
              </div>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute top-3 right-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black p-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-blue-500/30 cursor-pointer"
              type="button"
            >
              <X size={16} />
            </button>
            
            {/* Navigation Buttons */}
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md hover:bg-gradient-to-r hover:from-white hover:to-cyan-400 text-white p-2 rounded-full transition-all duration-300 cursor-pointer"
                  type="button"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md hover:bg-gradient-to-r hover:from-white hover:to-cyan-400 text-white p-2 rounded-full transition-all duration-300 cursor-pointer"
                  type="button"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            
            {/* Image Actions Toolbar */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {/* Zoom Controls */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="bg-black/60 hover:bg-gradient-to-r hover:from-white hover:to-cyan-400 text-white p-1 rounded-full transition-all duration-300 cursor-pointer"
                disabled={zoomLevel >= 3}
                type="button"
              >
                <ZoomIn size={16} className={zoomLevel >= 3 ? 'opacity-50' : ''} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="bg-black/60 hover:bg-gradient-to-r hover:from-white hover:to-cyan-400 text-white p-1 rounded-full transition-all duration-300 cursor-pointer" 
                disabled={zoomLevel <= 1}
                type="button"
              >
                <ZoomOut size={16} className={zoomLevel <= 1 ? 'opacity-50' : ''} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  resetZoom();
                }}
                className="bg-black/60 hover:bg-gradient-to-r hover:from-white hover:to-cyan-400 text-white p-1 rounded-full transition-all duration-300 cursor-pointer"
                disabled={zoomLevel === 1}
                type="button"
              >
                <Maximize size={16} className={zoomLevel === 1 ? 'opacity-50' : ''} />
              </button>
              
              {/* Separator */}
              <div className="h-4 w-px bg-blue-800"></div>
    
              <button 
                onClick={(e) => handleDownload(e)}
                className="bg-black/60 hover:bg-gradient-to-r hover:from-white hover:to-cyan-400 text-white p-1 rounded-full transition-all duration-300 cursor-pointer"
                type="button"
              >
                <Download size={16} />
              </button>
              <button 
                onClick={(e) => handleShare(e)}
                className="bg-black/60 hover:bg-gradient-to-r hover:from-white hover:to-cyan-400 text-white p-1 rounded-full transition-all duration-300 cursor-pointer"
                type="button"
              >
                <Share2 size={16} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(selectedImage);
                }}
                className="bg-black/60 hover:bg-gradient-to-r hover:from-white hover:to-cyan-400 text-white p-1 rounded-full transition-all duration-300 cursor-pointer"
                type="button"
              >
                <Heart size={16} className={favorites.includes(selectedImage) ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </div>
            
            {/* Image Counter Indicator */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-white to-cyan-400/80 px-2 py-1 rounded-full">
              <span className="text-black font-bold text-xs font-['Orbitron']">
                {selectedImage + 1} / {allImages.length}
              </span>
            </div>
            
            {/* Thumbnail Navigation */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-black/70 backdrop-blur-md p-2">
              <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar">
                {allImages.map((image, index) => (
                  <div
                    key={`modal-thumb-${index}`}
                    className={`
                      h-12 w-16 flex-shrink-0
                      bg-black/80 rounded-md overflow-hidden 
                      transition-all duration-300 cursor-pointer
                      border
                      ${selectedImage === index 
                        ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-sm shadow-cyan-500/30 z-10 scale-110' 
                        : 'border-blue-900 hover:border-cyan-400 opacity-70 hover:opacity-100'
                      }
                      ${favorites.includes(index) ? 'ring-1 ring-red-500/30' : ''}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThumbnailClick(index);
                    }}
                  >
                    <img
                      src={image.path}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryTab;