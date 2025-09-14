// Test script for the ingredient agent API endpoint
const testMealPlan = [
    {
        "day": 1,
        "lunch": {
            "id": 1,
            "name": "Spinach and Ricotta Pasta",
            "num_servings": 2,
            "ingredients": [
                {
                    "name": "dried farfalle or tagliatelle",
                    "quantity": 150,
                    "unit": "g"
                },
                {
                    "name": "fresh or frozen spinach",
                    "quantity": 200,
                    "unit": "g"
                },
                {
                    "name": "unsalted butter",
                    "quantity": 50,
                    "unit": "g"
                },
                {
                    "name": "garlic clove",
                    "quantity": 1,
                    "unit": "piece"
                },
                {
                    "name": "ricotta",
                    "quantity": 125,
                    "unit": "g"
                },
                {
                    "name": "nutmeg",
                    "quantity": 1,
                    "unit": "pinch"
                },
                {
                    "name": "pecorino (or vegetarian hard cheese)",
                    "quantity": 1,
                    "unit": "tbsp"
                },
                {
                    "name": "salt and pepper",
                    "quantity": 1,
                    "unit": "to taste"
                }
            ],
            "tags": {
                "meal_type": ["Lunch"],
                "cuisine_region": ["Italian"],
                "dietary_preferences": ["Vegetarian"],
                "difficulty_level": ["Easy"]
            },
            "cooking_method": ["Boiling", "Sautéing"],
            "equipment_needed": ["Pot", "Frying Pan", "Mixing Bowl"],
            "flavor_profile": ["Savory", "Creamy"],
            "macros": {
                "calories": 500,
                "protein_g": 20,
                "carbs_g": 60,
                "fat_g": 18,
                "fiber_g": 5
            },
            "time_minutes": 25,
            "url": "https://www.bbc.co.uk/food/recipes/spinach_and_ricotta_58990",
            "thumbnail": "https://ichef.bbci.co.uk/food/ic/food_16x9_448/recipes/spinach_and_ricotta_58990_16x9.jpg"
        },
        "dinner": {
            "id": 2,
            "name": "Lentil Bolognese",
            "num_servings": 2,
            "ingredients": [
                {
                    "name": "olive oil",
                    "quantity": 1,
                    "unit": "tbsp"
                },
                {
                    "name": "onion",
                    "quantity": 1,
                    "unit": "piece"
                },
                {
                    "name": "garlic",
                    "quantity": 2,
                    "unit": "cloves"
                },
                {
                    "name": "red bell pepper",
                    "quantity": 0.5,
                    "unit": "piece"
                },
                {
                    "name": "carrot",
                    "quantity": 1,
                    "unit": "piece"
                },
                {
                    "name": "mushrooms",
                    "quantity": 0.5,
                    "unit": "cup"
                },
                {
                    "name": "red wine",
                    "quantity": 0.5,
                    "unit": "cup"
                },
                {
                    "name": "diced tomatoes",
                    "quantity": 400,
                    "unit": "g"
                },
                {
                    "name": "vegetable broth",
                    "quantity": 1,
                    "unit": "cup"
                },
                {
                    "name": "green lentils",
                    "quantity": 1,
                    "unit": "can"
                }
            ],
            "tags": {
                "meal_type": ["Dinner"],
                "cuisine_region": ["Italian"],
                "dietary_preferences": ["Vegetarian"],
                "difficulty_level": ["Easy"]
            },
            "cooking_method": ["Sautéing", "Simmering"],
            "equipment_needed": ["Pot", "Knife", "Cutting Board"],
            "flavor_profile": ["Savory"],
            "macros": {
                "calories": 400,
                "protein_g": 18,
                "carbs_g": 54,
                "fat_g": 8,
                "fiber_g": 12
            },
            "time_minutes": 55,
            "url": "https://www.allrecipes.com/recipe/256885/lentil-bolognese/",
            "thumbnail": "https://www.allrecipes.com/thmb/FveTR5egCQXhn0BLIVhuAnBPBPQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/4573958-ac38ed49317b4c47a3d382800e0a8e39.jpg"
        }
    },
    {
        "day": 2,
        "lunch": {
            "id": 3,
            "name": "Creamy Courgette Lasagne",
            "num_servings": 2,
            "ingredients": [
                {
                    "name": "dried lasagne sheets",
                    "quantity": 5,
                    "unit": "pieces"
                },
                {
                    "name": "sunflower oil",
                    "quantity": 0.5,
                    "unit": "tbsp"
                },
                {
                    "name": "onion",
                    "quantity": 0.5,
                    "unit": "piece"
                },
                {
                    "name": "courgette",
                    "quantity": 350,
                    "unit": "g"
                },
                {
                    "name": "garlic cloves",
                    "quantity": 1,
                    "unit": "piece"
                },
                {
                    "name": "ricotta",
                    "quantity": 125,
                    "unit": "g"
                }
            ],
            "tags": {
                "meal_type": ["Lunch"],
                "cuisine_region": ["Italian"],
                "dietary_preferences": ["Vegetarian"],
                "difficulty_level": ["Easy"]
            },
            "cooking_method": ["Baking", "Sautéing"],
            "equipment_needed": ["Oven", "Frying Pan", "Baking Dish"],
            "flavor_profile": ["Savory", "Creamy"],
            "macros": {
                "calories": 400,
                "protein_g": 18,
                "carbs_g": 38,
                "fat_g": 19,
                "fiber_g": 7
            },
            "time_minutes": 30,
            "url": "https://www.bbcgoodfood.com/recipes/creamy-courgette-lasagne",
            "thumbnail": "https://images.immediate.co.uk/production/volatile/sites/30/2022/03/Creamy-courgette-lasagne-e63aa0c.jpg?resize=1200%2C630"
        }
    }
];

async function testIngredientAgent() {
    try {
        console.log('Sending meal plan data to API...');
        console.log(`Meal plan contains ${testMealPlan.length} days`);
        
        // Count total ingredients
        let totalIngredients = 0;
        testMealPlan.forEach(day => {
            if (day.lunch) totalIngredients += day.lunch.ingredients.length;
            if (day.dinner) totalIngredients += day.dinner.ingredients.length;
            if (day.breakfast) totalIngredients += day.breakfast.ingredients.length;
        });
        console.log(`Total ingredients across all meals: ${totalIngredients}\n`);

        const response = await fetch('http://localhost:3000/api/toolhouse/ingredient-agent/ingredient-agent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testMealPlan)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ API Error:', response.status, response.statusText);
            console.error('Error details:', errorData);
            return;
        }

        const result = await response.json();
        console.log('✅ Success! API Response received\n');
        
        // Validate and display the response structure
        if (result.info && Array.isArray(result.info)) {
            console.log(`📊 Response Summary:`);
            console.log(`Found ${result.info.length} stores with ingredient information\n`);
            
            result.info.forEach((store, storeIndex) => {
                console.log(`🏪 Store ${storeIndex + 1}: ${store.store || 'Unknown'}`);
                console.log(`   Address: ${store.address || 'Not provided'}`);
                console.log(`   Ingredients: ${store.ingredient_info?.length || 0} items`);
                
                if (store.ingredient_info && store.ingredient_info.length > 0) {
                    console.log('   Sample ingredients:');
                    store.ingredient_info.slice(0, 3).forEach(ingredient => {
                        console.log(`     - ${ingredient.ingredient}: ${ingredient.available ? '✅ Available' : '❌ Not available'} ${ingredient.price ? `$${ingredient.price}` : 'No price'}`);
                    });
                    if (store.ingredient_info.length > 3) {
                        console.log(`     ... and ${store.ingredient_info.length - 3} more items`);
                    }
                }
                console.log('');
            });
            
            // Show full response (commented out by default to avoid clutter)
            // console.log('Full API Response:');
            // console.log(JSON.stringify(result, null, 2));
            
        } else {
            console.log('⚠️  Unexpected response format');
            console.log(JSON.stringify(result, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('Make sure your Next.js development server is running on port 3000');
        }
    }
}

// Run the test
console.log('🧪 Testing Ingredient Agent API Endpoint');
console.log('==========================================\n');
testIngredientAgent();
