import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { UserRecipeData } from '@/types';

const DATA_FILE = join(process.cwd(), 'data', 'user-recipes.json');

// Initialize with default data if file doesn't exist
function initializeUserRecipeData(userId: number): UserRecipeData {
  return {
    user_id: userId,
    favorites: [301, 303],
    custom_lists: [
      {
        id: "list-1",
        name: "Quick Meals",
        description: "Fast and easy recipes for busy days",
        recipe_ids: [302, 304],
        created_at: "2024-01-15T10:00:00Z",
        user_id: userId
      },
      {
        id: "list-2", 
        name: "Healthy Options",
        description: "Nutritious and balanced meals",
        recipe_ids: [303, 304],
        created_at: "2024-01-20T15:30:00Z",
        user_id: userId
      }
    ]
  };
}

function getUserRecipeData(userId: number): UserRecipeData {
  try {
    const data = readFileSync(DATA_FILE, 'utf8');
    const allUserData = JSON.parse(data);
    return allUserData.find((userData: UserRecipeData) => userData.user_id === userId) 
           || initializeUserRecipeData(userId);
  } catch (error) {
    // If file doesn't exist, return default data
    return initializeUserRecipeData(userId);
  }
}

function saveUserRecipeData(userId: number, userData: UserRecipeData): void {
  try {
    let allUserData: UserRecipeData[] = [];
    
    try {
      const data = readFileSync(DATA_FILE, 'utf8');
      allUserData = JSON.parse(data);
    } catch {
      // File doesn't exist, start with empty array
    }
    
    const existingIndex = allUserData.findIndex(data => data.user_id === userId);
    if (existingIndex >= 0) {
      allUserData[existingIndex] = userData;
    } else {
      allUserData.push(userData);
    }
    
    writeFileSync(DATA_FILE, JSON.stringify(allUserData, null, 2));
  } catch (error) {
    throw new Error('Failed to save user recipe data');
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const userRecipeData = getUserRecipeData(userId);
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
    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const userData: UserRecipeData = await request.json();
    userData.user_id = userId; // Ensure user_id matches the URL parameter
    
    saveUserRecipeData(userId, userData);
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error updating user recipe data:', error);
    return NextResponse.json({ error: 'Failed to update user recipe data' }, { status: 500 });
  }
}
