import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceKey, getSupabaseUrl } from '@/lib/env';

const supabaseUrl = getSupabaseUrl();
const supabaseServiceKey = getSupabaseServiceKey();

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    // Get total rooms
    const { count: totalRooms } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true });

    // Get available rooms
    const { count: availableRooms } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available');

    // Get total bookings
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    // Get active bookings (confirmed, checked_in)
    const { count: activeBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .in('status', ['confirmed', 'checked_in']);

    // Get pending bookings
    const { count: pendingBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get staff count
    const { count: staffCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'staff');

    // Calculate revenue (from confirmed and completed bookings)
    const { data: revenueData } = await supabase
      .from('bookings')
      .select('total_price')
      .in('status', ['confirmed', 'checked_in', 'checked_out']);

    const totalRevenue = revenueData?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0;

    // Get recent bookings
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles:user_id (
          full_name,
          email
        ),
        rooms:room_id (
          room_number,
          room_type
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get room status breakdown
    const { data: roomStatuses } = await supabase
      .from('rooms')
      .select('status')
      .then(({ data }) => {
        const statusCounts = data?.reduce((acc, room) => {
          acc[room.status] = (acc[room.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};
        return { data: statusCounts };
      });

    const stats = {
      totalRooms: totalRooms || 0,
      availableRooms: availableRooms || 0,
      occupiedRooms: (totalRooms || 0) - (availableRooms || 0),
      totalBookings: totalBookings || 0,
      activeBookings: activeBookings || 0,
      pendingBookings: pendingBookings || 0,
      totalUsers: totalUsers || 0,
      staffCount: staffCount || 0,
      totalRevenue,
      recentBookings: recentBookings || [],
      roomStatuses: roomStatuses.data || {}
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 });
  }
}