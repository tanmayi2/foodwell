import {
  Allergen,
  CookingMethod,
  Cuisine,
  DietaryRestriction,
  DifficultyLevel,
  MealType,
  Priority,
  Unit,
} from "@/lib/enums";

// User-related types
export interface MacroTargets {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
}

export interface Priorities {
  budget: "low" | "medium" | "high";
  health: "low" | "medium" | "high";
  convenience: "low" | "medium" | "high";
}

export interface User {
  id: number;
  name: string;
  email: string;
  dietary_restrictions: DietaryRestriction[];
  allergies: Allergen[];
  macro_targets: MacroTargets;
  liked_cuisines: Cuisine[];
  liked_ingredients: string[];
  disliked_cuisines: Cuisine[];
  disliked_ingredients: string[];
  liked_flavor_profile: string[];
  priorities: Priority[];
  address: string;
  city: string;
  state: string;
  zip: string;
}

// Fridge-related types
export interface FridgeItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface Fridge {
  id: number;
  items: FridgeItem[];
}

// Recipe-related types
export interface Ingredient {
  name: string;
  quantity: number;
  unit: Unit;
}

export interface RecipeTags {
  meal_type: MealType[];
  cuisine_region: Cuisine[];
  dietary_preferences: DietaryRestriction[];
  difficulty_level: DifficultyLevel[];
}

export interface RecipeMacros {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
}

export interface Recipe {
  id: number;
  name: string;
  num_servings: number;
  ingredients: Ingredient[];
  tags: RecipeTags;
  cooking_method: CookingMethod[];
  equipment_needed: string[];
  flavor_profile: string[];
  macros: RecipeMacros;
  time_minutes: number;
  url?: string;
  thumbnail?: string;
}

// Meal planning types
export interface MealPlanEntry {
  id: string;
  recipe: Recipe;
  day: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  servings: number;
}

export interface WeeklyMealPlan {
  id: string;
  user_id: number;
  week_start: string;
  meals: MealPlanEntry[];
}

// Grocery list types
export interface GroceryItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface GroceryList {
  id: string;
  user_id: number;
  meal_plan_id: string;
  items: GroceryItem[];
  generated_at: string;
}

// Recipe lists and favorites
export interface RecipeList {
  id: string;
  name: string;
  description?: string;
  recipe_ids: number[];
  created_at: string;
  user_id: number;
}

export interface UserRecipeData {
  user_id: number;
  favorites: number[];
  custom_lists: RecipeList[];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
