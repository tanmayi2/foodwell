import { User, Recipe, Fridge, MealPlanEntry, GroceryItem, UserRecipeData } from '@/types';
import { DietaryRestriction, Allergen, Priority, Cuisine, MealType, DifficultyLevel, CookingMethod, Unit } from '@/lib/enums';

export const mockUser: User = {
  id: 1,
  name: "Jaansi",
  email: "jaansi@example.com",
  dietary_restrictions: [DietaryRestriction.VEGETARIAN],
  allergies: [Allergen.PEANUTS],
  macro_targets: {
    calories: 2000,
    protein_g: 90,
    carbs_g: 220,
    fat_g: 67,
    fiber_g: 25
  },
  liked_cuisines: [Cuisine.CHINESE, Cuisine.MEDITERRANEAN],
  liked_ingredients: ["tofu", "quinoa", "spinach"],
  disliked_cuisines: [Cuisine.MEXICAN],
  disliked_ingredients: ["mushrooms"],
  liked_flavor_profile: ["spicy", "umami"],
  priorities: [Priority.HEALTH, Priority.SUSTAINABILITY],
  address: "123 Main St",
  city: "San Francisco",
  state: "CA",
  zip: "94102"
};

export const mockFridge: Fridge = {
  id: 1,
  items: [
    { name: "eggs", quantity: 6, unit: Unit.PIECE },
    { name: "milk", quantity: 1, unit: Unit.LITER },
    { name: "cheddar cheese", quantity: 200, unit: Unit.GRAM },
    { name: "Pasta", quantity: 200, unit: Unit.GRAM },
    { name: "Tomatoes", quantity: 3, unit: Unit.PIECE },
    { name: "Mozzarella", quantity: 150, unit: Unit.GRAM },
    { name: "Basil", quantity: 10, unit: Unit.GRAM },
    { name: "Garlic", quantity: 2, unit: Unit.CLOVE },
    { name: "Olive Oil", quantity: 2, unit: Unit.TABLESPOON },
    { name: "Salt", quantity: 1, unit: Unit.TEASPOON }
  ]
};

export const mockRecipes: Recipe[] = [
  {
    id: 301,
    name: "Spaghetti Carbonara",
    num_servings: 2,
    ingredients: [
      { name: "spaghetti", quantity: 200, unit: Unit.GRAM },
      { name: "bacon", quantity: 100, unit: Unit.GRAM },
      { name: "egg yolks", quantity: 2, unit: Unit.PIECE },
      { name: "parmesan cheese", quantity: 50, unit: Unit.GRAM },
      { name: "garlic", quantity: 1, unit: Unit.CLOVE },
      { name: "olive oil", quantity: 1, unit: Unit.TABLESPOON },
      { name: "black pepper", quantity: 1, unit: Unit.TEASPOON }
    ],
    tags: {
      meal_type: [MealType.LUNCH, MealType.DINNER],
      cuisine_region: [Cuisine.ITALIAN],
      dietary_preferences: [],
      difficulty_level: [DifficultyLevel.INTERMEDIATE]
    },
    cooking_method: [CookingMethod.BOILING, CookingMethod.FRYING],
    equipment_needed: ["Pot", "Frying Pan", "Mixing Bowl", "Tongs"],
    flavor_profile: ["Savory", "Umami"],
    macros: {
      calories: 670,
      protein_g: 28,
      carbs_g: 72,
      fat_g: 28,
      fiber_g: 3
    },
    time_minutes: 25,
    url: "https://example.com/carbonara",
    thumbnail: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400"
  },
  {
    id: 302,
    name: "Vegetable Fried Rice",
    num_servings: 3,
    ingredients: [
      { name: "rice", quantity: 200, unit: Unit.GRAM },
      { name: "eggs", quantity: 2, unit: Unit.PIECE },
      { name: "mixed vegetables", quantity: 150, unit: Unit.GRAM },
      { name: "soy sauce", quantity: 2, unit: Unit.TABLESPOON },
      { name: "garlic", quantity: 2, unit: Unit.CLOVE },
      { name: "ginger", quantity: 1, unit: Unit.TEASPOON },
      { name: "sesame oil", quantity: 1, unit: Unit.TABLESPOON }
    ],
    tags: {
      meal_type: [MealType.LUNCH, MealType.DINNER],
      cuisine_region: [Cuisine.CHINESE],
      dietary_preferences: [DietaryRestriction.VEGETARIAN],
      difficulty_level: [DifficultyLevel.EASY]
    },
    cooking_method: [CookingMethod.FRYING],
    equipment_needed: ["Wok", "Rice Cooker"],
    flavor_profile: ["Savory", "Umami"],
    macros: {
      calories: 420,
      protein_g: 15,
      carbs_g: 65,
      fat_g: 12,
      fiber_g: 4
    },
    time_minutes: 20,
    url: "https://example.com/fried-rice",
    thumbnail: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400"
  },
  {
    id: 303,
    name: "Mediterranean Quinoa Bowl",
    num_servings: 2,
    ingredients: [
      { name: "quinoa", quantity: 150, unit: Unit.GRAM },
      { name: "cherry tomatoes", quantity: 200, unit: Unit.GRAM },
      { name: "cucumber", quantity: 1, unit: Unit.PIECE },
      { name: "feta cheese", quantity: 100, unit: Unit.GRAM },
      { name: "olives", quantity: 50, unit: Unit.GRAM },
      { name: "olive oil", quantity: 2, unit: Unit.TABLESPOON },
      { name: "lemon juice", quantity: 1, unit: Unit.TABLESPOON }
    ],
    tags: {
      meal_type: [MealType.LUNCH, MealType.DINNER],
      cuisine_region: [Cuisine.MEDITERRANEAN],
      dietary_preferences: [DietaryRestriction.VEGETARIAN, DietaryRestriction.GLUTEN_FREE],
      difficulty_level: [DifficultyLevel.EASY]
    },
    cooking_method: [CookingMethod.BOILING],
    equipment_needed: ["Pot", "Mixing Bowl"],
    flavor_profile: ["Fresh", "Tangy"],
    macros: {
      calories: 380,
      protein_g: 16,
      carbs_g: 45,
      fat_g: 18,
      fiber_g: 6
    },
    time_minutes: 15,
    url: "https://example.com/quinoa-bowl",
    thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
  },
  {
    id: 304,
    name: "Asian Tofu Stir Fry",
    num_servings: 2,
    ingredients: [
      { name: "tofu", quantity: 200, unit: Unit.GRAM },
      { name: "broccoli", quantity: 150, unit: Unit.GRAM },
      { name: "bell peppers", quantity: 100, unit: Unit.GRAM },
      { name: "soy sauce", quantity: 2, unit: Unit.TABLESPOON },
      { name: "garlic", quantity: 2, unit: Unit.CLOVE },
      { name: "ginger", quantity: 1, unit: Unit.TEASPOON },
      { name: "sesame oil", quantity: 1, unit: Unit.TABLESPOON }
    ],
    tags: {
      meal_type: [MealType.LUNCH, MealType.DINNER],
      cuisine_region: [Cuisine.CHINESE],
      dietary_preferences: [DietaryRestriction.VEGETARIAN, DietaryRestriction.VEGAN],
      difficulty_level: [DifficultyLevel.EASY]
    },
    cooking_method: [CookingMethod.FRYING],
    equipment_needed: ["Wok", "Cutting Board"],
    flavor_profile: ["Savory", "Umami"],
    macros: {
      calories: 320,
      protein_g: 20,
      carbs_g: 15,
      fat_g: 22,
      fiber_g: 8
    },
    time_minutes: 15,
    url: "https://example.com/tofu-stir-fry",
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
  },
  {
    id: 305,
    name: "French Toast",
    num_servings: 2,
    ingredients: [
      { name: "bread slices", quantity: 4, unit: Unit.PIECE },
      { name: "eggs", quantity: 2, unit: Unit.PIECE },
      { name: "milk", quantity: 60, unit: Unit.MILLILITER },
      { name: "butter", quantity: 1, unit: Unit.TABLESPOON },
      { name: "cinnamon", quantity: 1, unit: Unit.TEASPOON },
      { name: "vanilla extract", quantity: 1, unit: Unit.TEASPOON }
    ],
    tags: {
      meal_type: [MealType.BREAKFAST, MealType.BRUNCH],
      cuisine_region: [Cuisine.FRENCH],
      dietary_preferences: [DietaryRestriction.VEGETARIAN],
      difficulty_level: [DifficultyLevel.EASY]
    },
    cooking_method: [CookingMethod.FRYING],
    equipment_needed: ["Frying Pan", "Mixing Bowl", "Whisk"],
    flavor_profile: ["Sweet", "Rich"],
    macros: {
      calories: 280,
      protein_g: 12,
      carbs_g: 32,
      fat_g: 12,
      fiber_g: 2
    },
    time_minutes: 10,
    url: "https://example.com/french-toast",
    thumbnail: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400"
  }
];

export const mockMealPlan: MealPlanEntry[] = [
  {
    id: "meal-1",
    recipe: mockRecipes[0],
    day: "Monday",
    meal_type: "dinner",
    servings: 2
  },
  {
    id: "meal-2", 
    recipe: mockRecipes[1],
    day: "Tuesday",
    meal_type: "lunch",
    servings: 1
  }
];

export const mockGroceryList: GroceryItem[] = [
  { name: "spaghetti", quantity: 200, unit: Unit.GRAM },
  { name: "bacon", quantity: 100, unit: Unit.GRAM },
  { name: "eggs", quantity: 4, unit: Unit.PIECE },
  { name: "parmesan cheese", quantity: 50, unit: Unit.GRAM },
  { name: "rice", quantity: 200, unit: Unit.GRAM }
];

// Recommendation function (unchanged)
export function getRecommendedRecipes(user: User, recipes: Recipe[]): Recipe[] {
  return recipes.filter(recipe => {
    // Check dietary restrictions
    const hasRestrictedIngredient = user.dietary_restrictions.some(restriction => {
      if (restriction === DietaryRestriction.VEGETARIAN) {
        return recipe.ingredients.some(ing => 
          ['beef', 'chicken', 'pork', 'fish', 'bacon'].includes(ing.name.toLowerCase())
        );
      }
      return false;
    });

    if (hasRestrictedIngredient) return false;

    // Check allergies
    const hasAllergen = user.allergies.some(allergy => {
      if (allergy === Allergen.PEANUTS) {
        return recipe.ingredients.some(ing => ing.name.toLowerCase().includes('peanut'));
      }
      return false;
    });

    if (hasAllergen) return false;

    // Prefer liked cuisines
    const hasLikedCuisine = recipe.tags.cuisine_region.some(cuisine => 
      user.liked_cuisines.includes(cuisine)
    );

    return hasLikedCuisine;
  });
}

// User recipe data for favorites and custom lists
export const mockUserRecipeData: UserRecipeData = {
  user_id: 1,
  favorites: [301, 303],
  custom_lists: [
    {
      id: "list-1",
      name: "Quick Meals",
      description: "Fast and easy recipes for busy days",
      recipe_ids: [302, 304],
      created_at: "2024-01-15T10:00:00Z",
      user_id: 1
    },
    {
      id: "list-2", 
      name: "Healthy Options",
      description: "Nutritious and balanced meals",
      recipe_ids: [303, 304],
      created_at: "2024-01-20T15:30:00Z",
      user_id: 1
    }
  ]
};
