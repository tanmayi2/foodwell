import { User, Recipe, Fridge } from '@/types';

export const mockUser: User = {
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

export const mockFridge: Fridge = {
  id: 1,
  items: [
    { name: "eggs", quantity: 6, unit: "pcs" },
    { name: "milk", quantity: 1, unit: "liter" },
    { name: "cheddar cheese", quantity: 200, unit: "grams" },
    { name: "spinach", quantity: 100, unit: "grams" },
    { name: "tofu", quantity: 300, unit: "grams" },
    { name: "rice", quantity: 500, unit: "grams" },
    { name: "olive oil", quantity: 250, unit: "ml" },
    { name: "garlic", quantity: 3, unit: "cloves" },
    { name: "onion", quantity: 2, unit: "pcs" },
    { name: "tomatoes", quantity: 4, unit: "pcs" }
  ]
};

export const mockRecipes: Recipe[] = [
  {
    id: 301,
    name: "Spaghetti Carbonara",
    num_servings: 2,
    ingredients: [
      { name: "spaghetti", quantity: 200, unit: "grams" },
      { name: "pancetta", quantity: 100, unit: "grams" },
      { name: "egg yolks", quantity: 2, unit: "pcs" },
      { name: "parmesan cheese", quantity: 50, unit: "grams" },
      { name: "garlic", quantity: 1, unit: "clove" },
      { name: "olive oil", quantity: 1, unit: "tbsp" },
      { name: "black pepper", quantity: 1, unit: "tsp" }
    ],
    tags: {
      meal_type: ["Lunch", "Dinner"],
      cuisine_region: ["Italian"],
      dietary_preferences: [],
      difficulty_level: ["Medium"]
    },
    cooking_method: ["Boiling", "Frying"],
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
    url: "https://www.bbcgoodfood.com/recipes/ultimate-spaghetti-carbonara-recipe"
  },
  {
    id: 302,
    name: "Vegetarian Fried Rice",
    num_servings: 3,
    ingredients: [
      { name: "rice", quantity: 200, unit: "grams" },
      { name: "eggs", quantity: 2, unit: "pcs" },
      { name: "mixed vegetables", quantity: 150, unit: "grams" },
      { name: "soy sauce", quantity: 2, unit: "tbsp" },
      { name: "garlic", quantity: 2, unit: "cloves" },
      { name: "ginger", quantity: 1, unit: "tsp" },
      { name: "sesame oil", quantity: 1, unit: "tbsp" }
    ],
    tags: {
      meal_type: ["Lunch", "Dinner"],
      cuisine_region: ["Asian"],
      dietary_preferences: ["Vegetarian"],
      difficulty_level: ["Easy"]
    },
    cooking_method: ["Stir-frying"],
    equipment_needed: ["Wok", "Rice Cooker"],
    flavor_profile: ["Savory", "Umami"],
    macros: {
      calories: 420,
      protein_g: 15,
      carbs_g: 65,
      fat_g: 12,
      fiber_g: 4
    },
    time_minutes: 20
  },
  {
    id: 303,
    name: "Mediterranean Quinoa Bowl",
    num_servings: 2,
    ingredients: [
      { name: "quinoa", quantity: 150, unit: "grams" },
      { name: "cucumber", quantity: 1, unit: "pcs" },
      { name: "cherry tomatoes", quantity: 200, unit: "grams" },
      { name: "feta cheese", quantity: 100, unit: "grams" },
      { name: "olives", quantity: 50, unit: "grams" },
      { name: "olive oil", quantity: 2, unit: "tbsp" },
      { name: "lemon juice", quantity: 1, unit: "tbsp" }
    ],
    tags: {
      meal_type: ["Lunch", "Dinner"],
      cuisine_region: ["Mediterranean"],
      dietary_preferences: ["Vegetarian", "Gluten-Free"],
      difficulty_level: ["Easy"]
    },
    cooking_method: ["Boiling"],
    equipment_needed: ["Pot", "Mixing Bowl"],
    flavor_profile: ["Fresh", "Tangy"],
    macros: {
      calories: 380,
      protein_g: 18,
      carbs_g: 45,
      fat_g: 16,
      fiber_g: 8
    },
    time_minutes: 15
  },
  {
    id: 304,
    name: "Spicy Tofu Stir Fry",
    num_servings: 2,
    ingredients: [
      { name: "tofu", quantity: 200, unit: "grams" },
      { name: "bell peppers", quantity: 150, unit: "grams" },
      { name: "broccoli", quantity: 100, unit: "grams" },
      { name: "soy sauce", quantity: 2, unit: "tbsp" },
      { name: "chili sauce", quantity: 1, unit: "tbsp" },
      { name: "garlic", quantity: 2, unit: "cloves" },
      { name: "vegetable oil", quantity: 1, unit: "tbsp" }
    ],
    tags: {
      meal_type: ["Lunch", "Dinner"],
      cuisine_region: ["Asian"],
      dietary_preferences: ["Vegetarian", "Vegan"],
      difficulty_level: ["Easy"]
    },
    cooking_method: ["Stir-frying"],
    equipment_needed: ["Wok", "Cutting Board"],
    flavor_profile: ["Spicy", "Savory"],
    macros: {
      calories: 290,
      protein_g: 22,
      carbs_g: 18,
      fat_g: 15,
      fiber_g: 6
    },
    time_minutes: 18
  },
  {
    id: 305,
    name: "Cheese Spinach Omelet",
    num_servings: 1,
    ingredients: [
      { name: "eggs", quantity: 3, unit: "pcs" },
      { name: "spinach", quantity: 50, unit: "grams" },
      { name: "cheddar cheese", quantity: 30, unit: "grams" },
      { name: "butter", quantity: 1, unit: "tbsp" },
      { name: "salt", quantity: 0.5, unit: "tsp" },
      { name: "black pepper", quantity: 0.25, unit: "tsp" }
    ],
    tags: {
      meal_type: ["Breakfast", "Lunch"],
      cuisine_region: ["French"],
      dietary_preferences: ["Vegetarian"],
      difficulty_level: ["Easy"]
    },
    cooking_method: ["Pan-frying"],
    equipment_needed: ["Non-stick Pan", "Spatula"],
    flavor_profile: ["Savory", "Creamy"],
    macros: {
      calories: 320,
      protein_g: 24,
      carbs_g: 4,
      fat_g: 23,
      fiber_g: 2
    },
    time_minutes: 10
  }
];

// Filter recipes that match user preferences (no allergies, dietary restrictions)
export const getRecommendedRecipes = (user: User, recipes: Recipe[]): Recipe[] => {
  return recipes.filter(recipe => {
    // Check dietary restrictions
    const isVegetarian = user.dietary_restrictions.includes('vegetarian');
    if (isVegetarian) {
      const hasVegetarianTag = recipe.tags.dietary_preferences.some(pref => 
        pref.toLowerCase().includes('vegetarian') || pref.toLowerCase().includes('vegan')
      );
      // If user is vegetarian, only show vegetarian/vegan recipes or recipes without meat
      if (!hasVegetarianTag && recipe.ingredients.some(ing => 
        ['pancetta', 'bacon', 'chicken', 'beef', 'pork', 'fish'].some(meat => 
          ing.name.toLowerCase().includes(meat)
        )
      )) {
        return false;
      }
    }

    // Check allergies
    const hasAllergens = recipe.ingredients.some(ingredient =>
      user.allergies.some(allergy => 
        ingredient.name.toLowerCase().includes(allergy.toLowerCase())
      )
    );
    if (hasAllergens) return false;

    // Check disliked ingredients
    const hasDislikedIngredients = recipe.ingredients.some(ingredient =>
      user.disliked_ingredients.some(disliked => 
        ingredient.name.toLowerCase().includes(disliked.toLowerCase())
      )
    );
    if (hasDislikedIngredients) return false;

    return true;
  });
};
