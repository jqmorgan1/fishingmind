'use client'

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Fish, Navigation, Star, Plus, X } from 'lucide-react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface FishingSpot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  fish_types: string;
  rating: number;
  distance?: string;
}

interface MapProps {
  spots: FishingSpot[];
  center?: [number, number];
}

export default function FishingMap({ spots, center = [30.58, 114.27] }: MapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<FishingSpot | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Location error:', error);
        }
      );
    }
  }, []);

  const displayCenter = userLocation || center;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={displayCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="rounded-xl"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center">
                <p className="font-bold">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {spots.map((spot) => (
          <Marker 
            key={spot.id} 
            position={[spot.latitude, spot.longitude]}
            eventHandlers={{
              click: () => setSelectedSpot(spot),
            }}
          >
            <Popup>
              <div className="min-w-[150px]">
                <p className="font-bold">{spot.name}</p>
                <p className="text-sm text-gray-600">{spot.fish_types}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{spot.rating}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Add spot button */}
      <Link
        href="/spot/add"
        className="absolute top-4 right-4 bg-[#FF6B35] text-white p-3 rounded-full shadow-lg z-[1000]"
      >
        <Plus className="h-5 w-5" />
      </Link>

      {/* Selected spot details */}
      {selectedSpot && (
        <div className="absolute bottom-20 left-4 right-4 bg-[#1A2832] rounded-xl p-4 border border-gray-700 z-[1000]">
          <button
            onClick={() => setSelectedSpot(null)}
            className="absolute top-2 right-2 text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 bg-[#1A5F2A] rounded-lg flex items-center justify-center">
              <Fish className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{selectedSpot.name}</h3>
              <p className="text-sm text-gray-400">{selectedSpot.fish_types}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{selectedSpot.rating}</span>
                {selectedSpot.distance && (
                  <span className="text-sm text-gray-400 ml-2">{selectedSpot.distance}</span>
                )}
              </div>
            </div>
          </div>
          <button className="w-full mt-3 bg-[#FF6B35] text-white py-2 rounded-lg text-sm font-medium">
            View Details
          </button>
        </div>
      )}
    </div>
  );
}
