// Toolhouse API client for recipe agent
import { recipeAgentUrl, recipeAgentApiKey } from './constants';

interface ToolhouseAgentResponse {
  runId?: string;
  content?: string;
  error?: string;
  // idk what the expected response format is
}

interface AgentCallOptions {
  message: string;
  runId?: string; // For continuing conversations
}

class RecipeAgent {
  private agentUrl: string;
  private apiKey: string;

  constructor(agentUrl: string, apiKey: string) {
    this.agentUrl = agentUrl;
    this.apiKey = apiKey;
  }

  /**
   * Call the Toolhouse agent with a message
   * @param options - Message and optional runId for continuing conversations
   * @returns Promise with response data and runId
   */
  async callAgent(options: AgentCallOptions): Promise<ToolhouseAgentResponse> {
    const { message, runId } = options;
    
    // Determine if this is a new conversation (POST) or continuation (PUT)
    const method = runId ? 'PUT' : 'POST';
    const url = runId ? `${this.agentUrl}/${runId}` : this.agentUrl;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if API key is provided (for private agents)
    if (this.apiKey && this.apiKey !== 'YOUR_TOOLHOUSE_API_KEY') {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Toolhouse API error: ${response.status} ${response.statusText}`);
      }

      // Extract the Run ID from response headers for conversation continuation
      const responseRunId = response.headers.get('X-Toolhouse-Run-ID') || response.headers.get('x-toolhouse-run-id');
      
      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let content = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          content += chunk;
          
          // Log streaming chunks for debugging
          console.log('Streaming chunk:', chunk);
        }
      }

      return {
        runId: responseRunId || undefined,
        content,
      };
    } catch (error) {
      console.error('Error calling Toolhouse agent:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Start a new conversation with the agent
   */
  async startConversation(message: string): Promise<ToolhouseAgentResponse> {
    return this.callAgent({ message });
  }

  /**
   * Continue an existing conversation using a Run ID
   */
  async continueConversation(message: string, runId: string): Promise<ToolhouseAgentResponse> {
    return this.callAgent({ message, runId });
  }
}

// Create and export the recipe agent instance
export const recipeAgent = new RecipeAgent(recipeAgentUrl, recipeAgentApiKey);

// Example usage - generate meal plan for Jaansi
const userProfile = {
  id: 1,
  name: "Jaansi",
  dietary_restrictions: ["vegetarian"],
  allergies: ["peanuts"],
  macro_targets: {
    calories: 2000,
    protein_g: 90,
    carbs_g: 220,
    fat_g: 70,
    fiber_g: 30
  },
  liked_cuisines: ["asian", "mediterranean"],
  liked_ingredients: ["cheese", "spinach", "tofu"],
  disliked_cuisines: ["mexican"],
  disliked_ingredients: ["broccoli", "mushrooms"],
  liked_flavor_profile: ["savory", "spicy"],
  priorities: {
    budget: "medium",
    health: "high",
    convenience: "medium"
  },
  address: "50 Rogers St",
  city: "Cambridge",
  state: "MA",
  zip: "02139"
};

const mealPlanRequest = `Generate a full 7 day meal plan for this user profile: ${JSON.stringify(userProfile)}. Return the meal plan in JSON format with complete recipes. Do not shorten days and ensure all recipes are legitimate and follow the user's dietary restrictions and preferences.`;

// Test the agent
recipeAgent.startConversation(mealPlanRequest)
  .then(response => {
    console.log('Recipe Agent Response:');
    console.log('Run ID:', response.runId);
    console.log('Content:', response.content);
    
    if (response.error) {
      console.error('Error:', response.error);
    }
  })
  .catch(console.error);