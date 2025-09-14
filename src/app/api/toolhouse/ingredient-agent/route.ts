import { NextRequest, NextResponse } from 'next/server';
import { ingredientAgentUrl, ingredientAgentApiKey } from '../constants';

interface IngredientAgentRequest {
  location: string;
  ingredients: string[];
}

interface IngredientAgentResponse {
  info: StoreInfo[];
}

interface StoreInfo {
  store: string;
  address: string;
  ingredient_info: IngredientInfo[];
}

interface IngredientInfo {
    ingredient: string;
    available: boolean;
    price: number;
    quantity: number;
    unit: string;
    url: string;
    product_name: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<IngredientAgentResponse | { error: string }>> {
  try {
    const body: IngredientAgentRequest = await request.json();
    
    console.log('Making request to:', ingredientAgentUrl);
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const response = await fetch(ingredientAgentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ingredientAgentApiKey}`,
      },
      body: JSON.stringify(body),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch ingredient information', details: errorText },
        { status: response.status }
      );
    }

    const data: IngredientAgentResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in ingredient agent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}