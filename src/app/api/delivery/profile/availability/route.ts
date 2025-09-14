import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/delivery/profile/availability - Toggle deliverer availability
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { availability_status } = body;

    if (typeof availability_status !== 'boolean') {
      return NextResponse.json({ error: 'Invalid availability status' }, { status: 400 });
    }

    // Update user metadata with new availability status
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        availability_status,
        last_availability_change: new Date().toISOString()
      }
    });

    if (updateError) {
      console.error('Availability update error:', updateError);
      return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      availability_status,
      message: availability_status ? 'You are now available for deliveries' : 'You are now offline'
    });

  } catch (error) {
    console.error('Availability API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/delivery/profile/availability - Get current availability status
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const availability_status = user.user_metadata?.availability_status ?? true;
    const last_availability_change = user.user_metadata?.last_availability_change || null;

    return NextResponse.json({
      availability_status,
      last_availability_change
    });

  } catch (error) {
    console.error('Availability fetch API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
