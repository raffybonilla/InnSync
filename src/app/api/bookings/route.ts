import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceKey, getSupabaseUrl } from '@/lib/env';

const supabaseUrl = getSupabaseUrl();
const supabaseServiceKey = getSupabaseServiceKey();

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('user_id');

    let query = supabase
      .from('bookings')
      .select(`
        *,
        profiles:user_id (
          full_name,
          email
        ),
        rooms:room_id (
          room_number,
          room_type,
          price_per_night
        )
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, special_requests } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (special_requests !== undefined) updateData.special_requests = special_requests;

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        profiles:user_id (
          full_name,
          email
        ),
        rooms:room_id (
          room_number,
          room_type,
          price_per_night
        )
      `)
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}