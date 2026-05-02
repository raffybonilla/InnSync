'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Amenity {
  name: string;
  icon: string;
}

interface Hotel {
  id: number;
  name: string;
  hotel_name: string;
  price_per_night: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  amenities: Amenity[];
  room_size: string;
  max_guests: number;
  bed_type: string;
}

export default function HotelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id;
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'eps' | 'giropay'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [country, setCountry] = useState('United States');
  const [postalCode, setPostalCode] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleBookNow = () => {
    setShowPaymentForm(true);
    setPaymentSuccess(null);
    setPaymentError(null);
  };

  const handlePaymentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (paymentMethod === 'card') {
      if (!cardNumber || !expiry || !cvc) {
        setPaymentError('Please complete your card details.');
        return;
      }
    }

    if (!country || !postalCode) {
      setPaymentError('Please select your country and postal code.');
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: hotel?.id,
          amount: hotel?.price_per_night,
          paymentMethod,
          cardNumber,
          expiry,
          cvc,
          country,
          postalCode,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setPaymentError(data.error || 'Payment failed, please try again.');
      } else {
        setPaymentSuccess(data.message || 'Payment and booking successful.');
        setShowPaymentForm(false);
      }
    } catch (err) {
      console.error(err);
      setPaymentError('Payment could not be completed.');
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/hotels');
        const data = await response.json();

        const foundHotel = data.hotels.find((h: Hotel) => h.id === parseInt(hotelId as string));
        if (foundHotel) {
          setHotel(foundHotel);
        } else {
          setError('Hotel not found');
        }
      } catch (err) {
        setError('Failed to fetch hotel details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Hotel not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/user/dashboard" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Inn Sync</h1>
          <div></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hotel Header with Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow mb-8">
          <div className="relative h-96 bg-gray-200">
            {!imageError ? (
              <img
                src={hotel.images[0]}
                alt={hotel.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <span className="text-gray-500">Image not available</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Title and Rating */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
              <p className="text-lg text-yellow-500 font-medium mb-3">📍 {hotel.hotel_name}</p>
              
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <div className="flex text-yellow-400 text-xl">
                  {'⭐'.repeat(Math.floor(hotel.rating))}
                </div>
                <span className="text-lg font-bold text-gray-800">{hotel.rating}</span>
                <span className="text-gray-600">({hotel.reviews} reviews)</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="text-gray-500 font-medium">Room Size</p>
                  <p className="text-gray-900 font-semibold">{hotel.room_size}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Max Guests</p>
                  <p className="text-gray-900 font-semibold">{hotel.max_guests} Person</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Bed Type</p>
                  <p className="text-gray-900 font-semibold">{hotel.bed_type}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this room</h2>
              <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">{amenity.icon}</div>
                    <p className="text-sm text-gray-700 font-medium">{amenity.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-1">Price per night</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">${hotel.price_per_night}</span>
                  <span className="text-gray-500">/night</span>
                </div>
              </div>

              {!paymentSuccess && (
                <button
                  onClick={handleBookNow}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-3"
                >
                  Book Now
                </button>
              )}

              {paymentSuccess && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
                  <p className="font-semibold">Payment Complete</p>
                  <p className="text-sm mt-2">{paymentSuccess}</p>
                </div>
              )}

              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors mb-4">
                Save to Wishlist
              </button>

              {showPaymentForm && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mb-4">
                  <div className="mb-4">
                    <p className="text-sm text-slate-500 mb-2">Select payment method</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`rounded-xl border px-3 py-3 text-left transition ${paymentMethod === 'card' ? 'border-blue-600 bg-white shadow-sm' : 'border-slate-200 bg-slate-100'}`}
                      >
                        <div className="font-semibold text-sm">Card</div>
                        <div className="text-xs text-slate-500 mt-1">Visa, MasterCard</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('eps')}
                        className={`rounded-xl border px-3 py-3 text-left transition ${paymentMethod === 'eps' ? 'border-blue-600 bg-white shadow-sm' : 'border-slate-200 bg-slate-100'}`}
                      >
                        <div className="font-semibold text-sm">EPS</div>
                        <div className="text-xs text-slate-500 mt-1">European Payment</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('giropay')}
                        className={`rounded-xl border px-3 py-3 text-left transition ${paymentMethod === 'giropay' ? 'border-blue-600 bg-white shadow-sm' : 'border-slate-200 bg-slate-100'}`}
                      >
                        <div className="font-semibold text-sm">Giropay</div>
                        <div className="text-xs text-slate-500 mt-1">German banking</div>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handlePaymentSubmit}>
                    {paymentMethod === 'card' && (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Card number</label>
                          <input
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="1234 1234 1234 1234"
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Expiry</label>
                            <input
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                              placeholder="MM / YY"
                              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">CVC</label>
                            <input
                              value={cvc}
                              onChange={(e) => setCvc(e.target.value)}
                              placeholder="CVC"
                              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none"
                        >
                          <option>United States</option>
                          <option>Germany</option>
                          <option>Philippines</option>
                          <option>United Kingdom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Postal code</label>
                        <input
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="90210"
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {paymentError && (
                      <div className="mb-3 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                        {paymentError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={paymentLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      {paymentLoading ? 'Processing...' : `Pay $${hotel.price_per_night}`}
                    </button>
                  </form>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 text-center mb-4">
                  Free cancellation up to 48 hours before arrival
                </p>
                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                  ✓ Best Price Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
