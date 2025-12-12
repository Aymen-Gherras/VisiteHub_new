import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { mockProperties } from '../../../data/data/mockProperties';
import { formatPrice } from '../../../data/utils';

export const FeaturedProperties: React.FC = () => {
  // Get first 3 properties for featured section
  const featuredProperties = mockProperties.slice(0, 3);
  
  return (
    <section id="properties" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Propriétés en <span className="bg-gradient-to-r from-green-600 to-emarld-600 bg-clip-text text-transparent">vedette</span>
          </h2>
          <p className="text-xl text-gray-600">Découvrez nos biens immobiliers avec visite 360°</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <Card key={property.id} hover className="overflow-hidden">
              <div className="relative">
                <div className="aspect-[4/3] relative">

                </div>
                
                {/* Service Tier Badge */}
                <div className="absolute top-4 right-4">
                  <Badge variant={property.serviceTier === 'premium_360' ? 'premium' : 'basic'}>
                    {property.serviceTier === 'premium_360' ? (
                      <>
                        <i className="fas fa-vr-cardboard mr-1"></i>
                        360°
                      </>
                    ) : (
                      'Basique'
                    )}
                  </Badge>
                </div>
                
                {/* 360° Tour Indicator */}
                {property.has360Tour && (
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm">
                    <i className="fas fa-expand mr-1"></i>
                    Visite virtuelle
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{property.title}</h3>
                <p className="text-gray-600 mb-4">
                  {property.city} • {property.bedrooms} chambres • {property.surface}m²
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(property.price)}
                  </div>
                  <Button size="sm" variant="ghost">
                    {property.contactInfo.isAgency ? (
                      <>
                        Contacter agence <i className="fas fa-phone ml-1"></i>
                      </>
                    ) : (
                      <>
                        Voir détails <i className="fas fa-arrow-right ml-1"></i>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg">
            Voir toutes les propriétés
            <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </div>
    </section>
  );
};

