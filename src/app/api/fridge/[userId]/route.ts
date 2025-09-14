import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const supabase = await createClient();
    const { userId: userIdStr } = await params;
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: fridge, error } = await supabase
      .from('fridges')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching fridge:', error);
      return NextResponse.json({ error: 'Failed to fetch fridge' }, { status: 500 });
    }
    
    return NextResponse.json(fridge);
  } catch (error) {
    console.error('Error fetching fridge:', error);
    return NextResponse.json({ error: 'Failed to fetch fridge' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const supabase = await createClient();
    const { userId: userIdStr } = await params;
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fridgeData = await request.json();
    
    const { data: updatedFridge, error } = await supabase
      .from('fridges')
      .update({ items: fridgeData.items })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating fridge:', error);
      return NextResponse.json({ error: 'Failed to update fridge' }, { status: 500 });
    }
    
    return NextResponse.json(updatedFridge);
  } catch (error) {
    console.error('Error updating fridge:', error);
    return NextResponse.json({ error: 'Failed to update fridge' }, { status: 500 });
  }
}
