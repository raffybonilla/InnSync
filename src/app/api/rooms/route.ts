import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching room:', error);
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }

      return NextResponse.json({ room });
    }

    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_number');

    if (error) {
      console.error('Error fetching rooms:', error);
      return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
    }

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { room_number, room_type, capacity, price_per_night, status, amenities, description } = body;

    if (!room_number || !room_type || capacity == null || price_per_night == null) {
      return NextResponse.json(
        { error: 'Missing required fields: room_number, room_type, capacity, price_per_night' },
        { status: 400 }
      );
    }

    const { data: room, error } = await supabase
      .from('rooms')
      .insert([
        {
          room_number: String(room_number),
          room_type,
          capacity: Number(capacity),
          price_per_night: Number(price_per_night),
          status: status || 'available',
          amenities: amenities || [],
          description: description || '',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create room' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Room created successfully',
      room,
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
    const { id, status, room_type, capacity, price_per_night, amenities, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (room_type) updateData.room_type = room_type;
    if (capacity !== undefined) updateData.capacity = capacity;
    if (price_per_night !== undefined) updateData.price_per_night = price_per_night;
    if (amenities !== undefined) updateData.amenities = amenities;
    if (description !== undefined) updateData.description = description;

    const { data: room, error } = await supabase
      .from('rooms')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating room:', error);
      return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Room updated successfully',
      room,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting room:', error);
      return NextResponse.json(
        { error: 'Failed to delete room' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}