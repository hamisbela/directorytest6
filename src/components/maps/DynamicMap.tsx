import React, { useState, useEffect } from 'react';
import LocationMap from './LocationMap';

interface DynamicMapProps {
  latitude?: string | number;
  longitude?: string | number;
  title?: string;
  address?: string;
  height?: string;
  className?: string;
  zoom?: number;
  showPopup?: boolean;
}

// This component dynamically imports the map to avoid SSR issues
// and allows for better code splitting
const DynamicMap: React.FC<DynamicMapProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Show a placeholder until the map loads
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 animate-pulse ${props.className}`}
        style={{ height: props.height || '400px' }}
      >
        <div className="text-center text-gray-500">
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  return <LocationMap {...props} />;
};

export default DynamicMap;