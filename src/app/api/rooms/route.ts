import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Room ID and status are required' }, { status: 400 });
    }

    const { data: room, error } = await supabase
      .from('rooms')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating room:', error);
      return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
    }

    return NextResponse.json({ room });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}