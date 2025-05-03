import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Define markers for Morocco's major cities
const demoMapData = {
  cityMarkers: [
    { id: 1, city: 'Casablanca', bookings: 42, revenue: 6350, lat: 33.5731, lng: -7.5898 },
    { id: 2, city: 'Rabat', bookings: 28, revenue: 4200, lat: 34.0209, lng: -6.8416 },
    { id: 3, city: 'Marrakesh', bookings: 36, revenue: 5400, lat: 31.6295, lng: -7.9811 },
    { id: 4, city: 'Agadir', bookings: 22, revenue: 3300, lat: 30.4278, lng: -9.5981 },
    { id: 5, city: 'Mohammedia', bookings: 18, revenue: 2700, lat: 33.6835, lng: -7.3859 },
    { id: 6, city: 'Tangier', bookings: 24, revenue: 3600, lat: 35.7595, lng: -5.8340 }
  ],
  carMarkers: [
    { id: 101, name: 'Mercedes S-Class', category: 'Luxury', status: 'Active', lat: 33.5731, lng: -7.5898 },
    { id: 102, name: 'BMW X5', category: 'SUV', status: 'Active', lat: 31.6295, lng: -7.9811 },
    { id: 103, name: 'Audi A8', category: 'Luxury', status: 'Active', lat: 34.0209, lng: -6.8416 },
    { id: 104, name: 'Range Rover', category: 'SUV', status: 'Active', lat: 30.4278, lng: -9.5981 },
    { id: 105, name: 'Porsche Cayenne', category: 'SUV', status: 'Active', lat: 33.6835, lng: -7.3859 }
  ],
  heatmap: [
    [33.5731, -7.5898, 0.8], // Casablanca
    [31.6295, -7.9811, 0.6], // Marrakesh
    [34.0209, -6.8416, 0.5], // Rabat
    [30.4278, -9.5981, 0.4], // Agadir
    [35.7595, -5.8340, 0.4], // Tangier
    [33.6835, -7.3859, 0.3]  // Mohammedia
  ]
};

// Component to handle map data updates
function MapUpdater({ data, mapType }) {
  const map = useMap();
  
  useEffect(() => {
    // Clear custom layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer._heat || 
         (layer.options && layer.options.pane === 'markerPane')) {
        map.removeLayer(layer);
      }
    });
    
    // Add base tile layer if needed
    let hasBaseTile = false;
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        hasBaseTile = true;
      }
    });
    
    if (!hasBaseTile) {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }
    
    // Add city markers
    if (data.cityMarkers && data.cityMarkers.length > 0) {
      data.cityMarkers.forEach(marker => {
        // Enhanced marker design with pulsating effect
        const markerSize = marker.bookings/2 + 25;
        const markerIcon = L.divIcon({
          html: `
            <div class="relative">
              <div class="absolute w-full h-full rounded-full bg-cyan-500 opacity-20 animate-ping"></div>
              <div class="absolute w-full h-full rounded-full bg-cyan-500 opacity-10 animate-ping" style="animation-delay: 0.5s"></div>
              <div class="relative bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-cyan-400" 
                   style="width:${markerSize}px;height:${markerSize}px;font-size:${marker.bookings/10 + 10}px;box-shadow:0 0 15px rgba(6,182,212,0.7);">
                ${marker.bookings}
              </div>
            </div>
          `,
          className: '',
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize/2, markerSize/2]
        });
        
        L.marker([marker.lat, marker.lng], { icon: markerIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-3 max-w-[220px]">
              <h3 class="font-bold text-lg text-cyan-600 border-b pb-1 mb-2 truncate">${marker.city}</h3>
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-gray-400">Bookings:</span>
                <span class="bg-cyan-800/50 text-cyan-200 py-1 px-2 rounded font-semibold">${marker.bookings}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-400">Revenue:</span>
                <span class="bg-green-800/50 text-green-200 py-1 px-2 rounded font-semibold">$${marker.revenue}</span>
              </div>
            </div>
          `, { className: 'custom-popup', maxWidth: 220 });
      });
    }
    
    // Add heatmap or car markers based on mapType
    if (mapType === 'heatmap' && data.heatmap && data.heatmap.length > 0) {
      try {
        // @ts-ignore - Because L.heatLayer is added by plugin
        L.heatLayer(data.heatmap, {
          radius: 35,
          blur: 25,
          maxZoom: 10,
          max: 1.0,
          minOpacity: 0.3,
          gradient: {
            0.2: '#06b6d4', // cyan-500
            0.4: '#0284c7', // sky-600
            0.6: '#2563eb', // blue-600
            0.8: '#7c3aed', // violet-600
            1.0: '#c026d3'  // fuchsia-600
          }
        }).addTo(map);
      } catch (err) {
        console.error('Error creating heatmap:', err);
      }
    } else if (mapType === 'markers' && data.carMarkers && data.carMarkers.length > 0) {
      data.carMarkers.forEach(car => {
        const carIcon = L.divIcon({
          html: `
            <div class="relative group">
              <div class="absolute w-10 h-10 rounded-full bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-all duration-300 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div class="bg-black/90 text-cyan-400 rounded-full p-1.5 border-2 border-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative z-10" style="width:34px;height:34px;">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <div class="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/90 text-white text-xs rounded-md py-1 px-2 -mt-1 top-0 left-1/2 transform -translate-x-1/2 -translate-y-full z-20 border border-cyan-500/30 whitespace-nowrap pointer-events-none">
                ${car.name}
              </div>
            </div>
          `,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });
        
        L.marker([car.lat, car.lng], { icon: carIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-3 max-w-[220px]">
              <h3 class="font-bold text-lg text-cyan-600 border-b pb-1 mb-2 truncate">${car.name}</h3>
              <div class="grid grid-cols-[auto,1fr] gap-2 items-center">
                <span class="font-medium text-gray-600 text-sm">Category:</span>
                <span class="font-semibold text-gray-800 text-sm truncate">${car.category}</span>
              </div>
              <div class="grid grid-cols-[auto,1fr] gap-2 items-center mt-1">
                <span class="font-medium text-gray-600 text-sm">Status:</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ${car.status}
                </span>
              </div>
            </div>
          `, { className: 'custom-popup', maxWidth: 200 });
      });
    }

    // Add custom controls
    if (!document.querySelector('.custom-map-controls')) {
      const customControls = L.control({ position: 'bottomleft' });
      customControls.onAdd = function() {
        const div = L.DomUtil.create('div', 'custom-map-controls');
        div.innerHTML = `
          <div class="bg-black/70 text-white p-2 rounded-lg shadow-lg m-3">
            <div class="text-xs text-cyan-400 font-bold mb-1">Map Statistics</div>
            <div class="grid grid-cols-2 gap-x-2 text-xs">
              <span>Cities:</span><span class="text-cyan-300">${data.cityMarkers ? data.cityMarkers.length : 0}</span>
              <span>Cars:</span><span class="text-cyan-300">${data.carMarkers ? data.carMarkers.length : 0}</span>
            </div>
          </div>
        `;
        return div;
      };
      customControls.addTo(map);
    }

    // Add custom styles to fix popup layouts and map container
    if (!document.getElementById('map-custom-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'map-custom-styles';
      styleElement.innerHTML = `
        .leaflet-popup-content {
          margin: 0;
          min-width: 120px;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          overflow: hidden;
          padding: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(8, 145, 178, 0.4);
        }
        .custom-popup .leaflet-popup-tip {
          background: rgba(0,0,0,0.85);
          border: 1px solid rgba(8, 145, 178, 0.4);
        }
        .custom-popup h3 {
          color: rgb(8, 145, 178) !important;
          font-weight: bold;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(8, 145, 178, 0.3);
          margin-bottom: 8px;
        }
        .custom-popup .p-3 {
          color: rgba(255, 255, 255, 0.9);
        }
        .map-container {
          min-height: 400px;
        }
        .leaflet-control-zoom {
          border: 1px solid rgba(8, 145, 178, 0.3) !important;
          background: rgba(0,0,0,0.7) !important;
          backdrop-filter: blur(4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
          margin: 12px !important;
        }
        .leaflet-control-zoom a {
          color: rgb(8, 145, 178) !important;
          background: rgba(0,0,0,0.5) !important;
          border-bottom: 1px solid rgba(8, 145, 178, 0.2) !important;
          width: 30px !important;
          height: 30px !important;
          line-height: 30px !important;
          font-size: 16px !important;
          font-weight: normal !important;
        }
        .leaflet-control-zoom a:last-child {
          border-bottom: none !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(8, 145, 178, 0.2) !important;
          color: rgb(6, 182, 212) !important;
        }
        .leaflet-container {
          background-color: rgb(15, 23, 42) !important; /* slate-900 */
        }
        .leaflet-container .leaflet-pane {
          z-index: 5 !important;
        }
        .leaflet-container .leaflet-control-container {
          z-index: 20 !important;
        }
        .leaflet-bar {
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        .leaflet-bar a:first-child {
          border-top-left-radius: 8px !important;
          border-top-right-radius: 8px !important;
        }
        .leaflet-bar a:last-child {
          border-bottom-left-radius: 8px !important;
          border-bottom-right-radius: 8px !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, [map, data, mapType]);
  
  return null;
}

const MapVisualization = () => {
  const { accessToken } = useAuth();
  const [mapData, setMapData] = useState(demoMapData);
  const [loading, setLoading] = useState(false);
  const [mapType, setMapType] = useState('markers');
  const [error, setError] = useState(null);
  const [useDemoData, setUseDemoData] = useState(false);
  const [mapPeriod] = useState('all'); // Fixed period for simplified version

  // Use demo data if selected or as fallback
  const effectiveMapData = useDemoData ? demoMapData : mapData || demoMapData;

  // Fetch map data from the API
  const fetchMapData = async () => {
    // If demo data is enabled, use that
    if (useDemoData) {
      setMapData(demoMapData);
      setLoading(false);
      setError(null);
      return;
    }

    // Get the token from localStorage as a fallback if authToken is not available
    const token = localStorage.getItem('auth_token') || accessToken;
    
    if (!token) {
      console.log('No auth token found, using demo data');
      setLoading(false);
      setError('Authentication required');
      setUseDemoData(true); // Automatically switch to demo data if no token
      setMapData(demoMapData);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/admin/map-data', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          period: mapPeriod
        },
        timeout: 10000 // 10 second timeout to prevent infinite loading
      });

      if (response.data && response.data.status === 'success') {
        setMapData(response.data.data);
        setError(null);
      } else {
        console.warn('Map data fetch returned non-success status:', response.data);
        setError('Failed to fetch map data. Using demo data instead.');
        // Fallback to demo data
        setUseDemoData(true);
        setMapData(demoMapData);
      }
    } catch (err) {
      console.error('Error fetching map data:', err);
      setError('Error fetching map data. Using demo data instead.');
      // Fallback to demo data on error
      setUseDemoData(true);
      setMapData(demoMapData);
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts or filters change
  useEffect(() => {
    fetchMapData();
  }, [mapPeriod, accessToken, useDemoData]);

  // Toggle between heatmap and markers
  const toggleMapType = () => {
    setMapType(mapType === 'heatmap' ? 'markers' : 'heatmap');
  };

  // Set center to Morocco's approximate center
  const center = [31.7917, -7.0926];
  const zoom = 5;

  return (
    <div className="w-full h-full">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center h-full flex items-center justify-center">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="h-full">
          {/* Add custom styles for proper map container sizing */}
          <style jsx>{`
            .leaflet-container {
              height: 100% !important;
              width: 100%;
              font-family: 'Orbitron', sans-serif;
            }
          `}</style>
          <MapContainer 
            center={center} 
            zoom={zoom} 
            style={{ height: "100%", width: "100%", zIndex: 1 }}
            zoomControl={true}
            zoomAnimation={true}
            markerZoomAnimation={true}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapUpdater data={effectiveMapData} mapType={mapType} />
            
            {/* Control panel */}
            <div className="absolute top-3 right-3 z-50 flex flex-col gap-3">
              <div className="bg-black/80 backdrop-blur-md rounded-lg border border-cyan-500/20 p-1.5 shadow-lg">
                <button
                  onClick={toggleMapType}
                  className="flex items-center justify-center w-8 h-8 text-cyan-400 rounded-md hover:bg-cyan-500/10 transition-all"
                  title={mapType === 'markers' ? 'Switch to Heatmap' : 'Switch to Markers'}
                >
                  {mapType === 'markers' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button 
                  onClick={() => fetchMapData()}
                  className="flex items-center justify-center w-8 h-8 text-cyan-400 rounded-md hover:bg-cyan-500/10 transition-all mt-1"
                  title="Refresh Data"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Map legend */}
            <div className="absolute bottom-8 left-3 z-50 bg-black/80 backdrop-blur-md rounded-lg border border-cyan-500/20 p-2.5 shadow-lg text-xs max-w-[150px]">
              <div className="text-cyan-400 font-semibold mb-2 text-center">Map Legend</div>
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2 relative">
                  <div className="absolute inset-0 rounded-full bg-cyan-500 opacity-50 animate-ping"></div>
                </div>
                <span className="text-white">Booking Hotspot</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-black border border-cyan-500 rounded-full mr-2 flex items-center justify-center">
                  <svg className="h-2 w-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a1 1 0 011-1h2a1 1 0 010 2H9a1 1 0 01-1-1z" />
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white">Vehicle Location</span>
              </div>
            </div>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default MapVisualization; 