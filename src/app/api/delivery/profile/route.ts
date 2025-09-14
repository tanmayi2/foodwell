import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface DelivererProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vehicle_type?: string;
  license_plate?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  availability_status: boolean;
  preferred_delivery_zones?: string[];
  max_delivery_distance?: number;
  rating?: number;
  total_deliveries?: number;
  created_at: string;
  updated_at: string;
}

// GET /api/delivery/profile - Get deliverer profile
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get deliverer profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        role,
        address,
        city,
        state,
        zip,
        created_at,
        updated_at
      `)
      .eq('id', user.id)
      .eq('role', 'deliverer')
      .single();

    if (profileError) {
      console.error('Deliverer profile fetch error:', profileError);
      return NextResponse.json({ error: 'Failed to fetch deliverer profile' }, { status: 500 });
    }

    // Get delivery statistics
    const { data: deliveryStats, error: statsError } = await supabase
      .from('orders')
      .select('id, created_at, delivery_fee')
      .eq('deliverer_id', user.id)
      .eq('status', 'delivered');

    if (statsError) {
      console.error('Delivery stats error:', statsError);
    }

    const totalDeliveries = deliveryStats?.length || 0;
    const totalEarnings = deliveryStats?.reduce((sum, order) => sum + (order.delivery_fee || 0), 0) || 0;

    return NextResponse.json({
      ...profile,
      full_name: profile.name,
      email: user.email,
      phone: user.user_metadata?.phone || null,
      vehicle_type: user.user_metadata?.vehicle_type || null,
      license_plate: user.user_metadata?.license_plate || null,
      emergency_contact_name: user.user_metadata?.emergency_contact_name || null,
      emergency_contact_phone: user.user_metadata?.emergency_contact_phone || null,
      is_available: user.user_metadata?.availability_status ?? true,
      delivery_radius: user.user_metadata?.delivery_radius || 10,
      preferred_hours_start: user.user_metadata?.preferred_hours_start || '09:00',
      preferred_hours_end: user.user_metadata?.preferred_hours_end || '21:00',
      accepts_cash: user.user_metadata?.accepts_cash ?? true,
      accepts_card: user.user_metadata?.accepts_card ?? true,
      rating: 5.0, // Hardcoded for now
      total_deliveries: totalDeliveries,
      total_earnings: totalEarnings
    });

  } catch (error) {
    console.error('Deliverer profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/delivery/profile - Update deliverer profile
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      full_name,
      phone,
      address,
      vehicle_type,
      license_plate,
      emergency_contact_name,
      emergency_contact_phone,
      delivery_radius,
      preferred_hours_start,
      preferred_hours_end,
      accepts_cash,
      accepts_card
    } = body;

    // Update profile in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({
        name: full_name,
        address,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .eq('role', 'deliverer')
      .select()
      .single();

    if (profileError) {
      console.error('Profile update error:', profileError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    // Update user metadata for deliverer-specific fields
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        phone,
        vehicle_type,
        license_plate,
        emergency_contact_name,
        emergency_contact_phone,
        delivery_radius,
        preferred_hours_start,
        preferred_hours_end,
        accepts_cash,
        accepts_card
      }
    });

    if (metadataError) {
      console.error('Metadata update error:', metadataError);
      return NextResponse.json({ error: 'Failed to update deliverer details' }, { status: 500 });
    }

    return NextResponse.json({
      ...profile,
      full_name: profile.name,
      email: user.email,
      phone,
      vehicle_type,
      license_plate,
      emergency_contact_name,
      emergency_contact_phone,
      is_available: user.user_metadata?.availability_status ?? true,
      delivery_radius,
      preferred_hours_start,
      preferred_hours_end,
      accepts_cash,
      accepts_card
    });

  } catch (error) {
    console.error('Deliverer profile update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
