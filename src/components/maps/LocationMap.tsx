import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface LocationMapProps {
  latitude?: string | number;
  longitude?: string | number;
  title?: string;
  address?: string;
  height?: string;
  className?: string;
  zoom?: number;
  showPopup?: boolean;
}

const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  title = 'Location',
  address,
  height = '400px',
  className = '',
  zoom = 15,
  showPopup = true,
}) => {
  // Fix the marker icon issue in React Leaflet
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  // Check if valid coordinates are provided
  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
  
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg ${className}`} 
        style={{ height }}
      >
        <div className="text-center p-4">
          <p className="font-medium">Map location unavailable</p>
          <p className="text-sm mt-1">No valid coordinates provided</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <MapContainer 
        center={[lat, lng]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          {showPopup && (
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{title}</p>
                {address && <p className="mt-1">{address}</p>}
              </div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;