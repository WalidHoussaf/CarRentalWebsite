import React, { useState } from 'react';
import TabNavigation from './DetailsSections/TabNavigation';
import OverviewTab from './DetailsSections/tabs/OverviewTab';
import GalleryTab from './DetailsSections/tabs/GalleryTab';
import SpecificationsTab from './DetailsSections/tabs/SpecificationsTab';
import FeaturesTab from './DetailsSections/tabs/FeaturesTab';

const DetailsTabSection = ({ car }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section className="py-16 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Tabs Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Tab Content */}
        <div className="mb-20">
          {activeTab === 'overview' && <OverviewTab car={car} />}
          {activeTab === 'gallery' && <GalleryTab car={car} />}
          {activeTab === 'specifications' && <SpecificationsTab car={car} />}
          {activeTab === 'features' && <FeaturesTab car={car} />}
        </div>
      </div>
    </section>
  );
};

export default DetailsTabSection;