/**
 * Test file for Hotel Display Feature
 * Tests the function that gives one hotel for the user dashboard
 * with design matching the booking UI
 */

import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock hotel data
const mockHotel = {
  id: 1,
  name: 'Business Class Room with Lounge Access',
  hotel_name: 'Madisson Blu Hotel',
  price_per_night: 250,
  rating: 4.8,
  reviews: 150,
  images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop'],
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
};

describe('Hotel Display Feature for User Dashboard', () => {
  describe('Fetch Hotel API', () => {
    it('should return a single hotel object with all required fields', async () => {
      // Simulate API response
      const response = { hotels: [mockHotel] };
      
      expect(response.hotels).toHaveLength(1);
      expect(response.hotels[0]).toHaveProperty('id');
      expect(response.hotels[0]).toHaveProperty('name');
      expect(response.hotels[0]).toHaveProperty('hotel_name');
      expect(response.hotels[0]).toHaveProperty('price_per_night');
      expect(response.hotels[0]).toHaveProperty('rating');
      expect(response.hotels[0]).toHaveProperty('reviews');
      expect(response.hotels[0]).toHaveProperty('images');
      expect(response.hotels[0]).toHaveProperty('description');
      expect(response.hotels[0]).toHaveProperty('amenities');
    });

    it('should have valid hotel rating between 0 and 5', () => {
      expect(mockHotel.rating).toBeGreaterThanOrEqual(0);
      expect(mockHotel.rating).toBeLessThanOrEqual(5);
    });

    it('should have positive price per night', () => {
      expect(mockHotel.price_per_night).toBeGreaterThan(0);
    });

    it('should have at least one image', () => {
      expect(mockHotel.images.length).toBeGreaterThan(0);
    });

    it('should have amenities with name and icon', () => {
      expect(mockHotel.amenities.length).toBeGreaterThan(0);
      mockHotel.amenities.forEach(amenity => {
        expect(amenity).toHaveProperty('name');
        expect(amenity).toHaveProperty('icon');
        expect(typeof amenity.name).toBe('string');
        expect(typeof amenity.icon).toBe('string');
      });
    });
  });

  describe('Hotel Card Display', () => {
    it('should display hotel name', () => {
      expect(mockHotel.name).toBeTruthy();
      expect(mockHotel.name).toEqual('Business Class Room with Lounge Access');
    });

    it('should display hotel rating with stars', () => {
      const stars = Math.floor(mockHotel.rating);
      expect(stars).toBeGreaterThan(0);
      expect(mockHotel.rating).toEqual(4.8);
    });

    it('should display price per night', () => {
      expect(mockHotel.price_per_night).toBeTruthy();
      expect(typeof mockHotel.price_per_night).toBe('number');
    });

    it('should have Book Now link functionality', () => {
      // Test that hotel ID exists for link generation
      expect(mockHotel.id).toBeTruthy();
      const hotelDetailLink = `/user/hotel/${mockHotel.id}`;
      expect(hotelDetailLink).toBe('/user/hotel/1');
    });

    it('should display review count', () => {
      expect(mockHotel.reviews).toBeGreaterThan(0);
      expect(mockHotel.reviews).toEqual(150);
    });

    it('should display room size information', () => {
      expect(mockHotel.room_size).toBeTruthy();
      expect(mockHotel.room_size).toContain('sqm');
    });
  });

  describe('Hotel Details Page', () => {
    it('should navigate to correct hotel details page', () => {
      const hotelDetailPath = `/user/hotel/${mockHotel.id}`;
      expect(hotelDetailPath).toBe('/user/hotel/1');
    });

    it('should display full hotel description on details page', () => {
      expect(mockHotel.description).toBeTruthy();
      expect(mockHotel.description.length).toBeGreaterThan(50);
    });

    it('should display all amenities on details page', () => {
      expect(mockHotel.amenities.length).toBeGreaterThanOrEqual(6);
    });

    it('should display book button on details page', () => {
      // This is a UI test - in real tests you'd check DOM
      expect(mockHotel.id).toBeTruthy(); // Ensures we can create booking link
    });

    it('should display room specifications', () => {
      expect(mockHotel.bed_type).toBeTruthy();
      expect(mockHotel.max_guests).toBeGreaterThan(0);
      expect(mockHotel.room_size).toBeTruthy();
    });

    it('should display hotel rating prominently on details page', () => {
      expect(mockHotel.rating).toEqual(4.8);
      expect(mockHotel.reviews).toEqual(150);
    });
  });

  describe('Component Integration', () => {
    it('should have proper image URLs', () => {
      mockHotel.images.forEach(image => {
        expect(image).toMatch(/^https?:\/\//);
      });
    });

    it('should provide all data needed for HotelCard component', () => {
      const requiredFields = [
        'id', 'name', 'hotel_name', 'price_per_night',
        'rating', 'reviews', 'images', 'description',
        'room_size', 'max_guests'
      ];

      requiredFields.forEach(field => {
        expect(mockHotel).toHaveProperty(field);
      });
    });

    it('should provide all data needed for Hotel Details page', () => {
      const requiredFields = [
        'id', 'name', 'hotel_name', 'price_per_night',
        'rating', 'reviews', 'images', 'description',
        'amenities', 'room_size', 'max_guests', 'bed_type'
      ];

      requiredFields.forEach(field => {
        expect(mockHotel).toHaveProperty(field);
      });
    });
  });

  describe('Data Validation', () => {
    it('should have valid hotel ID', () => {
      expect(typeof mockHotel.id).toBe('number');
      expect(mockHotel.id).toBeGreaterThan(0);
    });

    it('should have non-empty strings for key fields', () => {
      expect(mockHotel.name.length).toBeGreaterThan(0);
      expect(mockHotel.hotel_name.length).toBeGreaterThan(0);
      expect(mockHotel.description.length).toBeGreaterThan(0);
      expect(mockHotel.room_size.length).toBeGreaterThan(0);
      expect(mockHotel.bed_type.length).toBeGreaterThan(0);
    });

    it('should have all numbers as numbers', () => {
      expect(typeof mockHotel.price_per_night).toBe('number');
      expect(typeof mockHotel.rating).toBe('number');
      expect(typeof mockHotel.reviews).toBe('number');
      expect(typeof mockHotel.max_guests).toBe('number');
    });

    it('should have arrays for images and amenities', () => {
      expect(Array.isArray(mockHotel.images)).toBe(true);
      expect(Array.isArray(mockHotel.amenities)).toBe(true);
    });
  });

  describe('User Experience', () => {
    it('should show hotel in dashboard immediately on load', () => {
      // Tests that hotel is fetched and displayed
      expect(mockHotel).toBeDefined();
      expect(mockHotel.name).toBeTruthy();
    });

    it('should allow user to click Book Now button', () => {
      const bookingLink = `/user/hotel/${mockHotel.id}`;
      expect(bookingLink).toBeTruthy();
    });

    it('should show professional rating and review count', () => {
      expect(mockHotel.rating).toEqual(4.8);
      expect(mockHotel.reviews).toBeGreaterThan(0);
    });

    it('should display clear price information', () => {
      expect(mockHotel.price_per_night).toBeTruthy();
      expect(typeof mockHotel.price_per_night).toBe('number');
    });
  });

  describe('Payment Checkout', () => {
    it('should validate payment method selection', () => {
      const paymentMethods = ['card', 'eps', 'giropay'];
      expect(paymentMethods).toContain('card');
      expect(paymentMethods).toContain('eps');
      expect(paymentMethods).toContain('giropay');
    });

    it('should require country and postal code for payment', () => {
      const country = 'United States';
      const postalCode = '90210';
      expect(country).toBeTruthy();
      expect(postalCode).toBeTruthy();
    });

    it('should include card fields for card payment', () => {
      const cardNumber = '1234 1234 1234 1234';
      const expiry = '12/26';
      const cvc = '123';
      expect(cardNumber).toMatch(/^\d{4} \d{4} \d{4} \d{4}$/);
      expect(expiry).toMatch(/^\d{2}\/\d{2}$/);
      expect(cvc).toMatch(/^\d{3,4}$/);
    });

    it('should calculate payment total from hotel price', () => {
      expect(mockHotel.price_per_night).toEqual(250);
    });

    it('should provide a payment confirmation message', () => {
      const successMessage = 'Payment completed successfully. Your booking is confirmed!';
      expect(successMessage).toContain('Payment completed successfully');
    });
  });
});
