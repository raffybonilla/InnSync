import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hotelId, amount, paymentMethod, cardNumber, expiry, cvc, country, postalCode } = body;

    if (!hotelId || !amount || !paymentMethod) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    if (paymentMethod === 'card' && (!cardNumber || !expiry || !cvc)) {
      return NextResponse.json({ error: 'Complete the card details to proceed' }, { status: 400 });
    }

    // Mock payment processing logic.
    // Replace this with a real payment provider integration later.
    return NextResponse.json({
      success: true,
      message: 'Payment completed successfully. Your booking is confirmed!',
      bookingId: `BOOKING-${Date.now()}`,
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}
