'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Hotel {
  id: number;
  name: string;
  hotel_name: string;
  price_per_night: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  max_guests: number;
  room_size: string;
}

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        {!imageError ? (
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">Image not available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Hotel Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-1">{hotel.name}</h3>
        <p className="text-sm text-yellow-500 font-medium mb-2">📍 {hotel.hotel_name}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {'⭐'.repeat(Math.floor(hotel.rating))}
          </div>
          <span className="text-sm font-semibold text-gray-700">{hotel.rating}</span>
          <span className="text-xs text-gray-500">({hotel.reviews} reviews)</span>
        </div>

        {/* Room Info */}
        <p className="text-xs text-gray-600 mb-2">{hotel.room_size}</p>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hotel.description}</p>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Per night</p>
            <p className="text-xl font-bold text-gray-800">${hotel.price_per_night}</p>
          </div>
          <Link
            href={`/user/hotel/${hotel.id}`}
            className="px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
