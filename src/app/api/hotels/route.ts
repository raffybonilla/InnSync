import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock hotel data
    const hotels = [
      {
        id: 1,
        name: 'Business Class Room with Lounge Access',
        hotel_name: 'Madisson Blu Hotel',
        price_per_night: 250,
        rating: 4.8,
        reviews: 150,
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop'
        ],
        description: 'Experience luxury at its finest when you reserve a Business Class Room with Lounge Access featuring your choice of a king bed or two twin beds. Enjoy all standard amenities, including free Wi-Fi and a work station, plus exclusive access to the Executive Lounge on the 20th floor.',
        amenities: [
          { name: 'Individual room climate control', icon: '❄️' },
          { name: 'Free Wi-Fi', icon: '📶' },
          { name: 'Professional hair dryer', icon: '💇' },
          { name: 'Dining room area', icon: '🍽️' },
          { name: 'Minibar or fridge', icon: '🧊' },
          { name: 'Bathrobe and slippers', icon: '👕' }
        ],
        room_size: '35 sqm | 1 Bed | 11 max',
        max_guests: 2,
        bed_type: '1 King Bed or 2 Twin Beds'
      }
    ];

    return NextResponse.json({ hotels });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }
}
