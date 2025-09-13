// Canonical enums for consistent data across the application

export enum DietaryRestriction {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  GLUTEN_FREE = 'gluten-free',
  DAIRY_FREE = 'dairy-free',
  NUT_FREE = 'nut-free',
  SOY_FREE = 'soy-free',
  EGG_FREE = 'egg-free',
  SHELLFISH_FREE = 'shellfish-free',
  FISH_FREE = 'fish-free',
  KETO = 'keto',
  PALEO = 'paleo',
  LOW_CARB = 'low-carb',
  LOW_SODIUM = 'low-sodium',
  LOW_FAT = 'low-fat',
  DIABETIC_FRIENDLY = 'diabetic-friendly',
  HEART_HEALTHY = 'heart-healthy',
  KOSHER = 'kosher',
  HALAL = 'halal'
}

export enum Cuisine {
  AMERICAN = 'american',
  ITALIAN = 'italian',
  MEXICAN = 'mexican',
  CHINESE = 'chinese',
  JAPANESE = 'japanese',
  KOREAN = 'korean',
  THAI = 'thai',
  INDIAN = 'indian',
  FRENCH = 'french',
  SPANISH = 'spanish',
  GREEK = 'greek',
  MEDITERRANEAN = 'mediterranean',
  MIDDLE_EASTERN = 'middle-eastern',
  MOROCCAN = 'moroccan',
  ETHIOPIAN = 'ethiopian',
  VIETNAMESE = 'vietnamese',
  FILIPINO = 'filipino',
  CARIBBEAN = 'caribbean',
  BRAZILIAN = 'brazilian',
  GERMAN = 'german',
  BRITISH = 'british',
  SCANDINAVIAN = 'scandinavian',
  RUSSIAN = 'russian',
  FUSION = 'fusion'
}

export enum MealType {
  BREAKFAST = 'breakfast',
  BRUNCH = 'brunch',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
  DESSERT = 'dessert',
  APPETIZER = 'appetizer',
  SIDE_DISH = 'side-dish',
  BEVERAGE = 'beverage'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  EASY = 'easy',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum CookingMethod {
  BAKING = 'baking',
  ROASTING = 'roasting',
  GRILLING = 'grilling',
  FRYING = 'frying',
  SAUTEING = 'sauteing',
  STEAMING = 'steaming',
  BOILING = 'boiling',
  BRAISING = 'braising',
  STEWING = 'stewing',
  SLOW_COOKING = 'slow-cooking',
  PRESSURE_COOKING = 'pressure-cooking',
  AIR_FRYING = 'air-frying',
  SMOKING = 'smoking',
  POACHING = 'poaching',
  BLANCHING = 'blanching',
  NO_COOK = 'no-cook'
}

export enum Ingredient {
  // Proteins
  CHICKEN = 'chicken',
  BEEF = 'beef',
  PORK = 'pork',
  SALMON = 'salmon',
  TUNA = 'tuna',
  SHRIMP = 'shrimp',
  EGGS = 'eggs',
  TOFU = 'tofu',
  TEMPEH = 'tempeh',
  BEANS = 'beans',
  LENTILS = 'lentils',
  CHICKPEAS = 'chickpeas',
  
  // Vegetables
  ONIONS = 'onions',
  GARLIC = 'garlic',
  TOMATOES = 'tomatoes',
  BELL_PEPPERS = 'bell-peppers',
  CARROTS = 'carrots',
  BROCCOLI = 'broccoli',
  SPINACH = 'spinach',
  MUSHROOMS = 'mushrooms',
  POTATOES = 'potatoes',
  SWEET_POTATOES = 'sweet-potatoes',
  ZUCCHINI = 'zucchini',
  CAULIFLOWER = 'cauliflower',
  ASPARAGUS = 'asparagus',
  KALE = 'kale',
  LETTUCE = 'lettuce',
  CUCUMBER = 'cucumber',
  AVOCADO = 'avocado',
  
  // Fruits
  APPLES = 'apples',
  BANANAS = 'bananas',
  BERRIES = 'berries',
  ORANGES = 'oranges',
  LEMONS = 'lemons',
  LIMES = 'limes',
  GRAPES = 'grapes',
  MANGO = 'mango',
  PINEAPPLE = 'pineapple',
  
  // Grains & Starches
  RICE = 'rice',
  PASTA = 'pasta',
  BREAD = 'bread',
  QUINOA = 'quinoa',
  OATS = 'oats',
  BARLEY = 'barley',
  
  // Dairy
  MILK = 'milk',
  CHEESE = 'cheese',
  YOGURT = 'yogurt',
  BUTTER = 'butter',
  CREAM = 'cream',
  
  // Nuts & Seeds
  ALMONDS = 'almonds',
  WALNUTS = 'walnuts',
  CASHEWS = 'cashews',
  PEANUTS = 'peanuts',
  SUNFLOWER_SEEDS = 'sunflower-seeds',
  CHIA_SEEDS = 'chia-seeds',
  
  // Herbs & Spices
  BASIL = 'basil',
  OREGANO = 'oregano',
  THYME = 'thyme',
  ROSEMARY = 'rosemary',
  CILANTRO = 'cilantro',
  PARSLEY = 'parsley',
  GINGER = 'ginger',
  TURMERIC = 'turmeric',
  CUMIN = 'cumin',
  PAPRIKA = 'paprika',
  BLACK_PEPPER = 'black-pepper',
  SALT = 'salt',
  
  // Oils & Condiments
  OLIVE_OIL = 'olive-oil',
  COCONUT_OIL = 'coconut-oil',
  SOY_SAUCE = 'soy-sauce',
  VINEGAR = 'vinegar',
  HONEY = 'honey',
  MAPLE_SYRUP = 'maple-syrup'
}

export enum FlavorProfile {
  SWEET = 'sweet',
  SALTY = 'salty',
  SOUR = 'sour',
  BITTER = 'bitter',
  UMAMI = 'umami',
  SPICY = 'spicy',
  MILD = 'mild',
  SMOKY = 'smoky',
  FRESH = 'fresh',
  RICH = 'rich',
  CREAMY = 'creamy',
  TANGY = 'tangy',
  SAVORY = 'savory',
  AROMATIC = 'aromatic',
  EARTHY = 'earthy',
  CITRUSY = 'citrusy',
  HERBAL = 'herbal',
  NUTTY = 'nutty',
  FRUITY = 'fruity',
  FLORAL = 'floral'
}

export enum Unit {
  // Volume
  CUP = 'cup',
  TABLESPOON = 'tablespoon',
  TEASPOON = 'teaspoon',
  FLUID_OUNCE = 'fluid-ounce',
  PINT = 'pint',
  QUART = 'quart',
  GALLON = 'gallon',
  MILLILITER = 'milliliter',
  LITER = 'liter',
  
  // Weight
  OUNCE = 'ounce',
  POUND = 'pound',
  GRAM = 'gram',
  KILOGRAM = 'kilogram',
  
  // Count
  PIECE = 'piece',
  ITEM = 'item',
  CLOVE = 'clove',
  SLICE = 'slice',
  BUNCH = 'bunch',
  HEAD = 'head',
  STALK = 'stalk',
  SPRIG = 'sprig',
  
  // Other
  PINCH = 'pinch',
  DASH = 'dash',
  TO_TASTE = 'to-taste',
  AS_NEEDED = 'as-needed'
}

export enum Allergen {
  MILK = 'milk',
  EGGS = 'eggs',
  FISH = 'fish',
  SHELLFISH = 'shellfish',
  TREE_NUTS = 'tree-nuts',
  PEANUTS = 'peanuts',
  WHEAT = 'wheat',
  SOYBEANS = 'soybeans',
  SESAME = 'sesame',
  SULFITES = 'sulfites',
  MUSTARD = 'mustard',
  CELERY = 'celery',
  LUPIN = 'lupin',
  MOLLUSCS = 'molluscs'
}

export enum Priority {
  HEALTH = 'health',
  CONVENIENCE = 'convenience',
  BUDGET = 'budget',
  TASTE = 'taste',
  SUSTAINABILITY = 'sustainability',
  LOCAL_INGREDIENTS = 'local-ingredients',
  ORGANIC = 'organic',
  MEAL_PREP = 'meal-prep',
  FAMILY_FRIENDLY = 'family-friendly',
  QUICK_MEALS = 'quick-meals',
  BATCH_COOKING = 'batch-cooking',
  SEASONAL = 'seasonal'
}

// Helper functions to get enum values as arrays
export const getDietaryRestrictions = () => Object.values(DietaryRestriction);
export const getCuisines = () => Object.values(Cuisine);
export const getMealTypes = () => Object.values(MealType);
export const getDifficultyLevels = () => Object.values(DifficultyLevel);
export const getCookingMethods = () => Object.values(CookingMethod);
export const getIngredients = () => Object.values(Ingredient);
export const getFlavorProfiles = () => Object.values(FlavorProfile);
export const getUnits = () => Object.values(Unit);
export const getAllergens = () => Object.values(Allergen);
export const getPriorities = () => Object.values(Priority);

// Helper functions to get display names
export const getDisplayName = (enumValue: string): string => {
  return enumValue
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
