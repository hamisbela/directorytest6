import React from 'react';
import { Clock, Globe, Mail, MapPin, Phone, Star, Zap } from 'lucide-react';
import { BeautySalon } from '../../types/models';
import { formatAddress } from '../../utils/formatting';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import DynamicMap from '../maps/DynamicMap';
import Animate from '../ui/Animate';

interface SalonDetailsProps {
  salon: BeautySalon;
}

const SalonDetails: React.FC<SalonDetailsProps> = ({ salon }) => {
  // Generate full address
  const fullAddress = formatAddress(
    salon.address,
    salon.city_name,
    salon.state_name,
    salon.postal_code
  );
  
  // Generate rating stars if available
  const renderRating = () => {
    if (!salon.average_star) return null;
    
    const rating = parseFloat(salon.average_star);
    if (isNaN(rating)) return null;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {salon.average_star} ({salon.reviews || '0'} reviews)
        </span>
      </div>
    );
  };

  const hasLocationData = salon.latitude && salon.longitude;
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card padding="lg" className="mb-8">
        <div className="sm:flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{salon.title}</h1>
            
            {fullAddress && (
              <div className="flex items-start mt-2 text-gray-600">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>{fullAddress}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
            {renderRating()}
            
            {salon.telephone && (
              <a 
                href={`tel:${salon.telephone}`} 
                className="mt-3 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </a>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div>
            {/* Details */}
            <div className="space-y-5">
              {salon.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-600">{salon.description}</p>
                </div>
              )}
              
              {salon.service_product && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Services</h3>
                  <p className="text-gray-600">{salon.service_product}</p>
                </div>
              )}
              
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <ul className="space-y-2">
                  {salon.telephone && (
                    <li className="flex items-start">
                      <Phone className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />
                      <span>
                        <a href={`tel:${salon.telephone}`} className="text-indigo-600 hover:underline">
                          {salon.telephone}
                        </a>
                      </span>
                    </li>
                  )}
                  
                  {salon.email && (
                    <li className="flex items-start">
                      <Mail className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />
                      <span>
                        <a href={`mailto:${salon.email}`} className="text-indigo-600 hover:underline">
                          {salon.email}
                        </a>
                      </span>
                    </li>
                  )}
                  
                  {salon.website && (
                    <li className="flex items-start">
                      <Globe className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />
                      <span>
                        <a 
                          href={salon.website.startsWith('http') ? salon.website : `https://${salon.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:underline"
                        >
                          {salon.website}
                        </a>
                      </span>
                    </li>
                  )}
                </ul>
              </div>
              
              {/* Hours */}
              {salon.opening_hours && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Business Hours</h3>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 whitespace-pre-line">{salon.opening_hours}</span>
                  </div>
                </div>
              )}
              
              {/* Categories */}
              {salon.category_ids && salon.category_ids.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {salon.category_ids.map(id => (
                      <Badge key={id} variant="primary">
                        {id}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            {/* Map */}
            <Animate type="fadeIn">
              {hasLocationData ? (
                <DynamicMap
                  latitude={salon.latitude}
                  longitude={salon.longitude}
                  title={salon.title}
                  address={fullAddress}
                  className="rounded-lg shadow-md overflow-hidden mb-6"
                  height="400px"
                  zoom={15}
                />
              ) : (
                <div className="bg-gray-100 rounded-lg p-6 text-center mb-6" style={{ height: '400px' }}>
                  <div className="flex flex-col items-center justify-center h-full">
                    <MapPin className="h-12 w-12 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium text-gray-600 mb-1">Map Unavailable</h3>
                    <p className="text-gray-500">Location coordinates not provided</p>
                  </div>
                </div>
              )}
            </Animate>
            
            {/* Images */}
            {salon.images && salon.images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Photos</h3>
                <div className="grid grid-cols-2 gap-3">
                  {salon.images.map((image, index) => (
                    <Animate key={index} type="fadeIn" delay={index * 0.1}>
                      <img 
                        src={image} 
                        alt={`${salon.title} - Image ${index + 1}`} 
                        className="rounded-lg w-full h-32 object-cover"
                      />
                    </Animate>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SalonDetails;