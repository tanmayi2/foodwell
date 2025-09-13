import { NextRequest, NextResponse } from 'next/server';
import { getFridge, updateFridge } from '@/lib/fileDb';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);
    const fridge = await getFridge(userId);
    
    if (!fridge) {
      return NextResponse.json({ error: 'Fridge not found' }, { status: 404 });
    }
    
    return NextResponse.json(fridge);
  } catch (error) {
    console.error('Error fetching fridge:', error);
    return NextResponse.json({ error: 'Failed to fetch fridge' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);
    const fridgeData = await request.json();
    
    const updatedFridge = await updateFridge(userId, fridgeData);
    return NextResponse.json(updatedFridge);
  } catch (error) {
    console.error('Error updating fridge:', error);
    return NextResponse.json({ error: 'Failed to update fridge' }, { status: 500 });
  }
}
