import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userRecipeData, error } = await supabase
      .from('user_recipes')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user recipe data:', error);
      return NextResponse.json({ error: 'Failed to fetch user recipe data' }, { status: 500 });
    }

    return NextResponse.json(userRecipeData);
  } catch (error) {
    console.error('Error fetching user recipe data:', error);
    return NextResponse.json({ error: 'Failed to fetch user recipe data' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await request.json();
    
    const { data: updatedUserRecipeData, error } = await supabase
      .from('user_recipes')
      .update({
        favorites: userData.favorites,
        custom_lists: userData.custom_lists
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user recipe data:', error);
      return NextResponse.json({ error: 'Failed to update user recipe data' }, { status: 500 });
    }
    
    return NextResponse.json(updatedUserRecipeData);
  } catch (error) {
    console.error('Error updating user recipe data:', error);
    return NextResponse.json({ error: 'Failed to update user recipe data' }, { status: 500 });
  }
}
