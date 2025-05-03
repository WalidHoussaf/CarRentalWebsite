import React from 'react';

const PageTitle = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-400 mt-1 font-['Rationale']">{subtitle}</p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageTitle; 