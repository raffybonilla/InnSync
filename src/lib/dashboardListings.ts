export const LISTING_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop",
];

import { getAmenityLabel } from "./amenities";

export interface ApiHotel {
  id: string;
  name: string;
  location: string;
  rating?: number;
  rooms?: number;
  available?: number;
  status?: string;
}

export interface ApiRoom {
  id: string;
  room_number: string;
  room_type: string;
  capacity: number;
  price_per_night: number;
  amenities?: string[];
  description?: string;
  status?: string;
}

export interface DashboardListing {
  id: string;
  name: string;
  image: string;
  rating: number;
  details: string;
  sqm: number;
  guests: number;
  bookLink: string;
  kind: "hotel" | "room";
}

export function formatAmenities(amenities?: string[]): string {
  if (!amenities?.length) return "";
  return amenities.map((id) => getAmenityLabel(id)).join(" • ");
}

export function buildDashboardListings(
  hotels: ApiHotel[],
  rooms: ApiRoom[]
): DashboardListing[] {
  const listings: DashboardListing[] = [];

  hotels
    .filter((h) => (h.status || "active") === "active")
    .forEach((hotel, index) => {
      listings.push({
        id: hotel.id,
        name: hotel.name,
        image: LISTING_IMAGES[index % LISTING_IMAGES.length],
        rating: Number(hotel.rating) || 4.5,
        details: `📍 ${hotel.location} • ${hotel.available ?? 0} rooms available`,
        sqm: 35,
        guests: Math.max(hotel.rooms || 1, 1),
        bookLink: `/hotels/${hotel.id}`,
        kind: "hotel",
      });
    });

  rooms
    .filter((r) => (r.status || "available") === "available")
    .forEach((room, index) => {
      const amenityText = formatAmenities(room.amenities);
      const details = [
        room.room_type,
        amenityText,
        room.description,
        `₱${room.price_per_night}/night`,
      ]
        .filter(Boolean)
        .join(" • ");

      listings.push({
        id: room.id,
        name: `Room ${room.room_number} — ${room.room_type}`,
        image: LISTING_IMAGES[(index + hotels.length) % LISTING_IMAGES.length],
        rating: 4.5,
        details: details || room.room_type,
        sqm: 30,
        guests: room.capacity,
        bookLink: `/rooms/${room.id}`,
        kind: "room",
      });
    });

  return listings;
}
