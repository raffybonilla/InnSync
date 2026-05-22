import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');

    let query = supabase.from('hotels').select('*');

    if (hotelId) {
      query = query.eq('id', hotelId);
    }

    const { data: hotels, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      console.error('Error fetching hotels:', error);
      return NextResponse.json(
        { error: 'Failed to fetch hotels' },
        { status: 500 }
      );
    }

    return NextResponse.json({ hotels: hotels || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, rating, rooms, available, status, revenue } = body;

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: hotel, error } = await supabase
      .from('hotels')
      .insert([
        {
          name,
          location,
          rating: rating || 0,
          rooms: rooms || 0,
          available: available || 0,
          status: status || 'active',
          revenue: revenue || '$0',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating hotel:', error);
      return NextResponse.json(
        { error: 'Failed to create hotel' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Hotel created successfully',
      hotel,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, location, rating, rooms, available, status, revenue } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (location) updateData.location = location;
    if (rating !== undefined) updateData.rating = rating;
    if (rooms !== undefined) updateData.rooms = rooms;
    if (available !== undefined) updateData.available = available;
    if (status) updateData.status = status;
    if (revenue) updateData.revenue = revenue;

    const { data: hotel, error } = await supabase
      .from('hotels')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating hotel:', error);
      return NextResponse.json(
        { error: 'Failed to update hotel' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Hotel updated successfully',
      hotel,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('hotels').delete().eq('id', id);

    if (error) {
      console.error('Error deleting hotel:', error);
      return NextResponse.json(
        { error: 'Failed to delete hotel' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Hotel deleted successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
