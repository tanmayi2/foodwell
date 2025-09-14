// Test script for the recipe agent API using the callToolhouseAgent function
// Since we can't easily import from TypeScript files in Node.js, we'll recreate the function here

// Import constants (we'll need to read them from the constants file)
const fs = require('fs');
const path = require('path');

// Read constants from the TypeScript file
const constantsPath = path.join(__dirname, 'src/app/api/toolhouse/constants.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');
const urlMatch = constantsContent.match(/export const recipeAgentUrl = '([^']+)'/);
const keyMatch = constantsContent.match(/export const recipeAgentApiKey = '([^']+)'/);

const recipeAgentUrl = urlMatch ? urlMatch[1] : '';
const recipeAgentApiKey = keyMatch ? keyMatch[1] : '';

// Recreate the callToolhouseAgent function from route.ts for .js
async function callToolhouseAgent(message, runId) {
  const method = runId ? 'PUT' : 'POST';
  const url = runId ? `${recipeAgentUrl}/${runId}` : recipeAgentUrl;
  
  const headers = {
    'Content-Type': 'application/json',
  };

  if (recipeAgentApiKey) {
    headers['Authorization'] = `Bearer ${recipeAgentApiKey}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`Toolhouse API error: ${response.status} ${response.statusText}`);
  }

  const responseRunId = response.headers.get('X-Toolhouse-Run-ID') || response.headers.get('x-toolhouse-run-id');
  
  // Read the full response text instead of streaming to avoid chunking issues
  const content = await response.text();
  
  return {
    content,
    runId: responseRunId || undefined,
  };
}

const testRecipeAgent = async () => {
  const userProfile = {
    id: 1,
    name: "Test User",
    dietary_restrictions: ["keto"],
    allergies: [],
    macro_targets: {
      calories: 2000,
      protein_g: 80,
      carbs_g: 200,
      fat_g: 65,
      fiber_g: 25
    },
    liked_cuisines: ["japanese"],
    liked_ingredients: ["salmon", "rice", "tomatoes"],
    disliked_cuisines: ["italian"],
    disliked_ingredients: ["peanuts"],
    liked_flavor_profile: ["umami"],
    priorities: {
      budget: "high",
      health: "high",
      convenience: "medium"
    },
    address: "123 Test St",
    city: "Boston",
    state: "MA",
    zip: "02101"
  };

  const message = `Generate a meal plan for this user profile: ${JSON.stringify(userProfile)}. Generate a simple 1-day meal plan with 3 meals for the user. Keep it brief and return as JSON.`;

  try {
    console.log('Testing callToolhouseAgent function directly...');
    console.log('Message:', message.substring(0, 200) + '...');
    
    // Test 1: Start new conversation
    console.log('\n🔄 Starting new conversation...');
    const result1 = await callToolhouseAgent(message);
    
    console.log('✅ First response:');
    console.log('Content length:', result1.content.length);
    console.log('Run ID:', result1.runId);
    console.log('First 300 characters:', result1.content.substring(0, 300));
    
    // Test 2: Continue conversation if we got a runId
    if (result1.runId) {
      console.log('\n🔄 Continuing conversation with runId...');
      const followUpMessage = "Can you make the breakfast recipe dairy-free?";
      
      const result2 = await callToolhouseAgent(followUpMessage, result1.runId);
      
      console.log('✅ Follow-up response:');
      console.log('Content length:', result2.content.length);
      console.log('Run ID:', result2.runId);
      console.log('First 300 characters:', result2.content.substring(0, 300));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
};

// Run the test
testRecipeAgent();

// Also export for potential use in other modules
module.exports = { testRecipeAgent };
