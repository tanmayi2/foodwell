import { NextRequest, NextResponse } from 'next/server';
import { recipeAgentUrl, recipeAgentApiKey } from '../constants';

interface RecipeAgentRequest {
  message: string;
  runId?: string;
  userProfile?: {
    id: number;
    name: string;
    dietary_restrictions: string[];
    allergies: string[];
    macro_targets: {
      calories: number;
      protein_g: number;
      carbs_g: number;
      fat_g: number;
      fiber_g: number;
    };
    liked_cuisines: string[];
    liked_ingredients: string[];
    disliked_cuisines: string[];
    disliked_ingredients: string[];
    liked_flavor_profile: string[];
    priorities: {
      budget: string;
      health: string;
      convenience: string;
    };
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface RecipeAgentResponse {
  success: boolean;
  data?: {
    content: string;
    runId?: string;
  };
  error?: string;
}

export async function callToolhouseAgent(message: string, runId?: string): Promise<{ content: string; runId?: string }> {
  const method = runId ? 'PUT' : 'POST';
  const url = runId ? `${recipeAgentUrl}/${runId}` : recipeAgentUrl;
  
  console.log(`Making ${method} request to:`, url);
  console.log('Message length:', message.length, 'characters');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (recipeAgentApiKey) {
    headers['Authorization'] = `Bearer ${recipeAgentApiKey}`;
    console.log('API key present:', !!recipeAgentApiKey);
  } else {
    console.log('No API key found');
  }

  const fetchStart = Date.now();
  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify({ message }),
  });
  console.log('Fetch completed in:', Date.now() - fetchStart + 'ms');

  if (!response.ok) {
    console.log('Response not OK:', response.status, response.statusText);
    throw new Error(`Toolhouse API error: ${response.status} ${response.statusText}`);
  }

  const responseRunId = response.headers.get('X-Toolhouse-Run-ID') || response.headers.get('x-toolhouse-run-id');
  
  // Read response with extended timeout
  const textStart = Date.now();
  const content = await Promise.race([
    response.text(),
    new Promise<string>((_, reject) => 
      setTimeout(() => reject(new Error('Response read timeout')), 120000)
    )
  ]);
  console.log('Response text read in:', Date.now() - textStart + 'ms');
  console.log('Response length:', content.length, 'characters');
  
  return {
    content,
    runId: responseRunId || undefined,
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<RecipeAgentResponse>> {
  const startTime = Date.now();
  console.log('Recipe agent API called at:', new Date().toISOString());
  
  try {
    const body: RecipeAgentRequest = await request.json();
    const { message, userProfile } = body;
    console.log('Request parsed in:', Date.now() - startTime + 'ms');

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // If userProfile is provided, format it into the message
    let formattedMessage = message;
    if (userProfile) {
      formattedMessage = `Generate a meal plan for this user profile: ${JSON.stringify(userProfile)}. ${message}`;
      console.log('Message formatted, calling Toolhouse agent...');
    }

    const toolhouseStart = Date.now();
    const result = await callToolhouseAgent(formattedMessage);
    console.log('Toolhouse agent responded in:', Date.now() - toolhouseStart + 'ms');
    console.log('Total API time:', Date.now() - startTime + 'ms');
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error calling recipe agent:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate recipe'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse<RecipeAgentResponse>> {
  try {
    const body: RecipeAgentRequest = await request.json();
    const { message, runId } = body;

    if (!message || !runId) {
      return NextResponse.json(
        { success: false, error: 'Message and runId are required for conversation continuation' },
        { status: 400 }
      );
    }

    const result = await callToolhouseAgent(message, runId);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error continuing recipe agent conversation:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to continue conversation'
      },
      { status: 500 }
    );
  }
}