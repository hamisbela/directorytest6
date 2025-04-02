import React from 'react';
import { MapPin, Building2, Map } from 'lucide-react';
import { State, City, BeautySalon } from '../../types/models';
import CityList from './CityList';
import SalonList from '../salons/SalonList';
import Card from '../ui/Card';
import Section from '../layout/Section';
import Hero from '../ui/Hero';
import DynamicMap from '../maps/DynamicMap';

interface StateDetailsProps {
  state: State;
  cities: City[];
  featuredSalons: BeautySalon[];
  loading?: boolean;
}

const STATE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'AL': { lat: 32.806671, lng: -86.791130 },
  'AK': { lat: 61.370716, lng: -152.404419 },
  'AZ': { lat: 33.729759, lng: -111.431221 },
  'AR': { lat: 34.969704, lng: -92.373123 },
  'CA': { lat: 36.116203, lng: -119.681564 },
  'CO': { lat: 39.059811, lng: -105.311104 },
  'CT': { lat: 41.597782, lng: -72.755371 },
  'DE': { lat: 39.318523, lng: -75.507141 },
  'FL': { lat: 27.766279, lng: -81.686783 },
  'GA': { lat: 33.040619, lng: -83.643074 },
  'HI': { lat: 21.094318, lng: -157.498337 },
  'ID': { lat: 44.240459, lng: -114.478828 },
  'IL': { lat: 40.349457, lng: -88.986137 },
  'IN': { lat: 39.849426, lng: -86.258278 },
  'IA': { lat: 42.011539, lng: -93.210526 },
  'KS': { lat: 38.526600, lng: -96.726486 },
  'KY': { lat: 37.668140, lng: -84.670067 },
  'LA': { lat: 31.169546, lng: -91.867805 },
  'ME': { lat: 44.693947, lng: -69.381927 },
  'MD': { lat: 39.063946, lng: -76.802101 },
  'MA': { lat: 42.230171, lng: -71.530106 },
  'MI': { lat: 43.326618, lng: -84.536095 },
  'MN': { lat: 45.694454, lng: -93.900192 },
  'MS': { lat: 32.741646, lng: -89.678696 },
  'MO': { lat: 38.456085, lng: -92.288368 },
  'MT': { lat: 46.921925, lng: -110.454353 },
  'NE': { lat: 41.125370, lng: -98.268082 },
  'NV': { lat: 38.313515, lng: -117.055374 },
  'NH': { lat: 43.452492, lng: -71.563896 },
  'NJ': { lat: 40.298904, lng: -74.521011 },
  'NM': { lat: 34.840515, lng: -106.248482 },
  'NY': { lat: 42.165726, lng: -74.948051 },
  'NC': { lat: 35.630066, lng: -79.806419 },
  'ND': { lat: 47.528912, lng: -99.784012 },
  'OH': { lat: 40.388783, lng: -82.764915 },
  'OK': { lat: 35.565342, lng: -96.928917 },
  'OR': { lat: 44.572021, lng: -122.070938 },
  'PA': { lat: 40.590752, lng: -77.209755 },
  'RI': { lat: 41.680893, lng: -71.511780 },
  'SC': { lat: 33.856892, lng: -80.945007 },
  'SD': { lat: 44.299782, lng: -99.438828 },
  'TN': { lat: 35.747845, lng: -86.692345 },
  'TX': { lat: 31.054487, lng: -97.563461 },
  'UT': { lat: 40.150032, lng: -111.862434 },
  'VT': { lat: 44.045876, lng: -72.710686 },
  'VA': { lat: 37.769337, lng: -78.169968 },
  'WA': { lat: 47.400902, lng: -121.490494 },
  'WV': { lat: 38.491226, lng: -80.954453 },
  'WI': { lat: 44.268543, lng: -89.616508 },
  'WY': { lat: 42.755966, lng: -107.302490 },
  // Default to center of USA
  'default': { lat: 39.8283, lng: -98.5795 }
};

const getStateCoordinates = (stateAbbr: string | undefined): { lat: number, lng: number } => {
  if (!stateAbbr) return STATE_COORDINATES.default;
  
  const key = stateAbbr.toUpperCase();
  return STATE_COORDINATES[key] || STATE_COORDINATES.default;
};

const StateDetails: React.FC<StateDetailsProps> = ({ 
  state, 
  cities, 
  featuredSalons, 
  loading = false 
}) => {
  const coordinates = getStateCoordinates(state.state.substr(0, 2));
  
  return (
    <>
      <Hero
        title={state.state}
        subtitle={`Find Electrolysis Hair Removal Providers in ${state.state}`}
        size="md"
      />
      
      <Section padding="md">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold mb-4">About {state.state}</h2>
              
              <div className="flex flex-wrap gap-4 text-gray-700 mb-6">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className="font-medium">
                    {state.salon_ids?.length || 0} {(state.salon_ids?.length || 0) === 1 ? 'Provider' : 'Providers'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className="font-medium">
                    {cities.length} {cities.length === 1 ? 'City' : 'Cities'}
                  </span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p>
                  Looking for permanent hair removal in {state.state}? Our directory connects you with qualified electrolysis 
                  specialists across the state. Electrolysis is the only FDA-approved method for permanent hair removal and 
                  works on all skin types and hair colors.
                </p>
                
                <p>
                  Browse our listings to find experienced professionals in {state.state} who can provide safe and effective 
                  treatments. Our directory makes it easy to compare providers, see their services, and contact them directly.
                </p>
              </div>
            </Card>
          </div>
          
          <div>
            <Card padding="none" className="overflow-hidden">
              <DynamicMap
                latitude={coordinates.lat}
                longitude={coordinates.lng}
                title={state.state}
                zoom={7}
                height="350px"
                showPopup={false}
              />
              
              <div className="p-4">
                <h3 className="font-medium text-lg flex items-center">
                  <Map className="h-5 w-5 text-indigo-500 mr-2" />
                  {state.state}
                </h3>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Featured Cities */}
        {cities.length > 0 && (
          <div className="mb-16">
            <CityList 
              cities={cities} 
              loading={loading} 
              title={`Cities in ${state.state}`}
            />
          </div>
        )}
        
        {/* Featured Salons */}
        {featuredSalons.length > 0 && (
          <SalonList
            salons={featuredSalons}
            loading={loading}
            title={`Featured Electrolysis Providers in ${state.state}`}
            emptyMessage={`We couldn't find any electrolysis providers in ${state.state} yet. Check back soon or be the first to add your business!`}
            limit={6}
            showViewAllLink
          />
        )}
      </Section>
    </>
  );
};

export default StateDetails;