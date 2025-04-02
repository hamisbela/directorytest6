import React from 'react';
import { Building2, MapPin } from 'lucide-react';
import { City, BeautySalon } from '../../types/models';
import SalonList from '../salons/SalonList';
import Card from '../ui/Card';
import Section from '../layout/Section';
import Hero from '../ui/Hero';
import DynamicMap from '../maps/DynamicMap';

interface CityDetailsProps {
  city: City;
  salons: BeautySalon[];
  loading?: boolean;
}

const DEFAULT_COORDINATES = {
  // Default coordinates for major US cities when specific coordinates are not available
  'New York': { lat: 40.7128, lng: -74.0060 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'Chicago': { lat: 41.8781, lng: -87.6298 },
  'Houston': { lat: 29.7604, lng: -95.3698 },
  'Phoenix': { lat: 33.4484, lng: -112.0740 },
  'Philadelphia': { lat: 39.9526, lng: -75.1652 },
  'San Antonio': { lat: 29.4241, lng: -98.4936 },
  'San Diego': { lat: 32.7157, lng: -117.1611 },
  'Dallas': { lat: 32.7767, lng: -96.7970 },
  'San Jose': { lat: 37.3382, lng: -121.8863 },
  // Default to center of USA if city not found
  'default': { lat: 39.8283, lng: -98.5795 }
};

const getCityCoordinates = (cityName: string): { lat: number, lng: number } => {
  const key = Object.keys(DEFAULT_COORDINATES).find(
    city => cityName.toLowerCase().includes(city.toLowerCase())
  );
  
  return key ? DEFAULT_COORDINATES[key as keyof typeof DEFAULT_COORDINATES] : DEFAULT_COORDINATES.default;
};

const CityDetails: React.FC<CityDetailsProps> = ({ city, salons, loading = false }) => {
  const coordinates = getCityCoordinates(city.city);
  
  return (
    <>
      <Hero
        title={city.city}
        subtitle={city.state_name ? `Electrolysis Hair Removal in ${city.city}, ${city.state_name}` : undefined}
        size="md"
      />
      
      <Section padding="md">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold mb-4">About {city.city}</h2>
              
              <p className="text-gray-600 mb-6">
                Find the best electrolysis hair removal providers in {city.city}{city.state_name ? `, ${city.state_name}` : ''}. 
                Our directory features trusted electrolysis specialists offering permanent hair removal services in this area.
              </p>
              
              <div className="flex items-center text-gray-700 mb-6">
                <Building2 className="h-5 w-5 text-indigo-500 mr-2" />
                <span className="font-medium">
                  {salons.length} {salons.length === 1 ? 'Provider' : 'Providers'} Available
                </span>
              </div>
              
              <div className="prose max-w-none">
                <p>
                  Electrolysis is the only permanent hair removal method approved by the FDA. Unlike other methods that reduce hair growth, 
                  electrolysis completely eliminates unwanted hair from all areas of the body, including eyebrows, face, abdomen, breasts, 
                  legs, and feet.
                </p>
                
                <p>
                  Our directory helps you find qualified electrologists in {city.city} who can provide these specialized services, 
                  making it easy to compare providers and find the best fit for your needs.
                </p>
              </div>
            </Card>
          </div>
          
          <div>
            <Card padding="none" className="overflow-hidden">
              <DynamicMap
                latitude={coordinates.lat}
                longitude={coordinates.lng}
                title={city.city}
                zoom={12}
                height="350px"
                showPopup={false}
              />
              
              <div className="p-4">
                <h3 className="font-medium text-lg flex items-center">
                  <MapPin className="h-5 w-5 text-indigo-500 mr-2" />
                  {city.city}{city.state_name ? `, ${city.state_name}` : ''}
                </h3>
              </div>
            </Card>
          </div>
        </div>
        
        <SalonList
          salons={salons}
          loading={loading}
          title={`Electrolysis Providers in ${city.city}`}
          emptyMessage={`We couldn't find any electrolysis providers in ${city.city} yet. Check back soon or browse providers in nearby cities.`}
        />
      </Section>
    </>
  );
};

export default CityDetails;