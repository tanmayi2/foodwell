import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input schema for meal plan data
const IngredientSchema = z.object({
  name: z.string(),
  quantity: z.number().nullable().optional(),
  unit: z.string().nullable().optional(),
});

const RecipeSchema = z.object({
  id: z.number(),
  name: z.string(),
  num_servings: z.number(),
  ingredients: z.array(IngredientSchema),
  tags: z.object({
    meal_type: z.array(z.string()),
    cuisine_region: z.array(z.string()),
    dietary_preferences: z.array(z.string()),
    difficulty_level: z.array(z.string()),
  }),
  cooking_method: z.array(z.string()),
  equipment_needed: z.array(z.string()),
  flavor_profile: z.array(z.string()),
  macros: z.object({
    calories: z.number(),
    protein_g: z.number(),
    carbs_g: z.number(),
    fat_g: z.number(),
    fiber_g: z.number(),
  }),
  time_minutes: z.number(),
  url: z.string(),
  thumbnail: z.string(),
});

const MealPlanDaySchema = z.object({
  day: z.number(),
  lunch: RecipeSchema.optional(),
  dinner: RecipeSchema.optional(),
  breakfast: RecipeSchema.optional(),
});

const MealPlanSchema = z.array(MealPlanDaySchema);

// Output schema for ingredient availability information
const IngredientInfoSchema = z.object({
  ingredient: z.string().nullable(),
  available: z.boolean().nullable(),
  price: z.number().nullable(),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
  url: z.string().nullable(),
  product_name: z.string().nullable(),
});

const StoreInfoSchema = z.object({
  store: z.string().nullable(),
  address: z.string().nullable(),
  ingredient_info: z.array(IngredientInfoSchema),
});

const OutputSchema = z.object({
  info: z.array(StoreInfoSchema),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the input meal plan data
    const mealPlan = MealPlanSchema.parse(body);
    
    // Extract all unique ingredients from the meal plan
    const ingredientsSet = new Set<string>();
    const ingredientsList: { name: string; quantity?: number | null; unit?: string | null }[] = [];
    
    mealPlan.forEach(day => {
      [day.breakfast, day.lunch, day.dinner].forEach(meal => {
        if (meal) {
          meal.ingredients.forEach(ingredient => {
            const key = `${ingredient.name}|${ingredient.unit || 'no-unit'}`;
            if (!ingredientsSet.has(key)) {
              ingredientsSet.add(key);
              ingredientsList.push({
                name: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
              });
            } else {
              // If ingredient already exists, sum up the quantities
              const existingIngredient = ingredientsList.find(
                item => item.name === ingredient.name && item.unit === ingredient.unit
              );
              if (existingIngredient && ingredient.quantity && existingIngredient.quantity) {
                existingIngredient.quantity += ingredient.quantity;
              }
            }
          });
        }
      });
    });

    // Create a formatted list of ingredients for the AI prompt
    const ingredientsListText = ingredientsList
      .map(ingredient => {
        const quantityText = ingredient.quantity ? `${ingredient.quantity}` : '';
        const unitText = ingredient.unit ? `${ingredient.unit}` : '';
        const quantityUnitText = quantityText && unitText ? `${quantityText} ${unitText} of ` : 
                                quantityText ? `${quantityText} of ` :
                                unitText ? `${unitText} of ` : '';
        return `${quantityUnitText}${ingredient.name}`;
      })
      .join('\n');

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: OutputSchema,
      prompt: `You are a grocery shopping assistant. Create a shopping list with ingredient availability and pricing from 2 stores.

INGREDIENTS NEEDED:
${ingredientsListText}

REQUIRED OUTPUT FORMAT:
You must return a JSON object with an "info" array containing exactly 2 stores. Each store must have:
- store: store name (string)
- address: store address (string) 
- ingredient_info: array of ALL ingredients listed above

For each ingredient in ingredient_info, provide:
- ingredient: exact ingredient name (string)
- available: true for common ingredients, false for specialty items (boolean)
- price: realistic price in USD (number, e.g., 2.99)
- quantity: package size (number, e.g., 500)
- unit: package unit (string, e.g., "g", "pieces", "ml")
- url: realistic product URL or null (string or null)
- product_name: specific product name or null (string or null)

EXAMPLE STRUCTURE:
{
  "info": [
    {
      "store": "Walmart",
      "address": "123 Main St, Boston, MA 02101",
      "ingredient_info": [
        {
          "ingredient": "olive oil",
          "available": true,
          "price": 4.99,
          "quantity": 500,
          "unit": "ml",
          "url": null,
          "product_name": "Great Value Extra Virgin Olive Oil"
        }
      ]
    }
  ]
}

Create realistic pricing and availability for ALL ${ingredientsList.length} ingredients across 2 different stores (like Walmart and Target). Make sure every ingredient appears in both stores' ingredient_info arrays.`,
    });

    return NextResponse.json(object);

  } catch (error) {
    
    console.error('Error processing ingredient agent request:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input format', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}