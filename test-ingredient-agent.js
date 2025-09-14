const testIngredientAgent = async () => {
  const testData = {
    location: "560 20th St, San Francisco, CA 94107",
    ingredients: ["2 large eggs", "5 tbsp olive oil", "1 roma tomato", "1 medium avocado"]
  };

  try {
    console.log('Testing ingredient agent with data:', testData);
    
    const response = await fetch('http://localhost:3003/api/toolhouse/ingredient-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseData = await response.json();
    console.log('Response data:', JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('✅ Test successful!');
      if (responseData.info && Array.isArray(responseData.info)) {
        console.log(`Found ${responseData.info.length} stores with ingredient information`);
        responseData.info.forEach((store, index) => {
          console.log(`\nStore ${index + 1}: ${store.store}`);
          console.log(`Address: ${store.address}`);
          console.log(`Ingredients found: ${store.ingredient_info.length}`);
        });
      }
    } else {
      console.log('❌ Test failed with error:', responseData);
    }
  } catch (error) {
    console.error('❌ Test failed with exception:', error.message);
  }
};

testIngredientAgent();
