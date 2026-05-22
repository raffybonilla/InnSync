import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, username, department } = body;

    // Validate required fields
    if (!fullName || !email || !username) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, username' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const { data: existingByUsername } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .limit(1);

    if (existingByUsername && existingByUsername.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const { data: existingByEmail } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (existingByEmail && existingByEmail.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create staff profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert([
        {
          full_name: fullName,
          email: email,
          username: username,
          role: 'staff',
          department: department || 'general',
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating staff profile:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create staff account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Staff account created successfully',
      profile,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = supabase.from('profiles').select('*');

    if (role) {
      query = query.eq('role', role);
    }

    const { data: profiles, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      console.error('Error fetching profiles:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profiles' },
        { status: 500 }
      );
    }

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
