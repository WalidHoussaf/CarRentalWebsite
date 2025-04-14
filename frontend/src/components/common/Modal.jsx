import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, centerContent = false }) => {
  useEffect(() => {
    // Disable body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 font-['Rationale'] p-4 pt-12">
      {/* Dark overlay */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-black border-2 border-cyan-800/40 rounded-lg shadow-2xl w-full max-w-2xl transform transition-all max-h-[85vh] mt-8 flex flex-col">
        {/* Background pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-black/10"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-700/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-700/50 to-transparent"></div>
          <div className="absolute top-20 right-10 w-32 h-32 bg-cyan-800/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-cyan-800/5 rounded-full blur-xl"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 bg-black border-b border-cyan-800/40 px-6 py-4 flex items-center justify-between rounded-t-lg backdrop-blur-sm">
          <h3 className="text-xl font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">{title}</h3>
          <button 
            onClick={onClose}
            className="text-cyan-500 hover:text-cyan-300 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body with scrolling */}
        <div className={`relative z-10 p-6 overflow-y-auto flex-1 ${centerContent ? 'flex flex-col items-center justify-center' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 