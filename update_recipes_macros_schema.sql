-- Update recipes table to use separate columns for macros instead of JSONB
-- First, add the new macro columns
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS calories INTEGER,
ADD COLUMN IF NOT EXISTS protein_g DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS carbs_g DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS fat_g DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS fiber_g DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS sugar_g DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS sodium_mg DECIMAL(8,2);

-- Migrate existing data from macros JSONB column to separate columns
UPDATE recipes 
SET 
    calories = COALESCE((macros->>'calories')::INTEGER, 0),
    protein_g = COALESCE((macros->>'protein_g')::DECIMAL(6,2), 0),
    carbs_g = COALESCE((macros->>'carbs_g')::DECIMAL(6,2), 0),
    fat_g = COALESCE((macros->>'fat_g')::DECIMAL(6,2), 0),
    fiber_g = COALESCE((macros->>'fiber_g')::DECIMAL(6,2), 0),
    sugar_g = COALESCE((macros->>'sugar_g')::DECIMAL(6,2), 0),
    sodium_mg = COALESCE((macros->>'sodium_mg')::DECIMAL(8,2), 0)
WHERE macros IS NOT NULL;

-- Set default values for any NULL entries
UPDATE recipes 
SET 
    calories = COALESCE(calories, 0),
    protein_g = COALESCE(protein_g, 0),
    carbs_g = COALESCE(carbs_g, 0),
    fat_g = COALESCE(fat_g, 0),
    fiber_g = COALESCE(fiber_g, 0),
    sugar_g = COALESCE(sugar_g, 0),
    sodium_mg = COALESCE(sodium_mg, 0);

-- Make the new columns NOT NULL now that they have values
ALTER TABLE recipes 
ALTER COLUMN calories SET NOT NULL,
ALTER COLUMN protein_g SET NOT NULL,
ALTER COLUMN carbs_g SET NOT NULL,
ALTER COLUMN fat_g SET NOT NULL,
ALTER COLUMN fiber_g SET NOT NULL,
ALTER COLUMN sugar_g SET NOT NULL,
ALTER COLUMN sodium_mg SET NOT NULL;

-- Add constraints to ensure positive values
ALTER TABLE recipes 
ADD CONSTRAINT check_calories_positive CHECK (calories >= 0),
ADD CONSTRAINT check_protein_positive CHECK (protein_g >= 0),
ADD CONSTRAINT check_carbs_positive CHECK (carbs_g >= 0),
ADD CONSTRAINT check_fat_positive CHECK (fat_g >= 0),
ADD CONSTRAINT check_fiber_positive CHECK (fiber_g >= 0),
ADD CONSTRAINT check_sugar_positive CHECK (sugar_g >= 0),
ADD CONSTRAINT check_sodium_positive CHECK (sodium_mg >= 0);

-- Create indexes for common macro-based queries
CREATE INDEX IF NOT EXISTS idx_recipes_calories ON recipes(calories);
CREATE INDEX IF NOT EXISTS idx_recipes_protein ON recipes(protein_g);
CREATE INDEX IF NOT EXISTS idx_recipes_carbs ON recipes(carbs_g);
CREATE INDEX IF NOT EXISTS idx_recipes_fat ON recipes(fat_g);

-- Drop the old macros JSONB column (uncomment when ready)
-- ALTER TABLE recipes DROP COLUMN IF EXISTS macros;

-- Insert some sample recipes with the new schema
INSERT INTO recipes (
    name, 
    description, 
    ingredients, 
    instructions, 
    time_minutes, 
    num_servings,
    calories,
    protein_g,
    carbs_g,
    fat_g,
    fiber_g,
    sugar_g,
    sodium_mg,
    tags,
    equipment_needed,
    thumbnail
) VALUES 
(
    'Grilled Chicken Breast',
    'Simple and healthy grilled chicken breast with herbs',
    '["chicken breast", "olive oil", "salt", "pepper", "thyme", "garlic"]',
    '["Season chicken with salt, pepper, and thyme", "Heat grill to medium-high", "Grill chicken 6-7 minutes per side", "Let rest 5 minutes before serving"]',
    20,
    2,
    185,
    35.0,
    0.0,
    3.6,
    0.0,
    0.0,
    74.0,
    '{"meal_type": ["lunch", "dinner"], "cuisine_region": ["american"], "difficulty_level": ["easy"], "dietary_restrictions": ["gluten_free", "dairy_free", "low_carb"]}',
    '["grill", "tongs"]',
    NULL
),
(
    'Quinoa Buddha Bowl',
    'Nutritious bowl with quinoa, vegetables, and tahini dressing',
    '["quinoa", "chickpeas", "spinach", "cherry tomatoes", "cucumber", "avocado", "tahini", "lemon", "olive oil"]',
    '["Cook quinoa according to package directions", "Roast chickpeas with olive oil and spices", "Prepare vegetables", "Make tahini dressing", "Assemble bowl with all ingredients"]',
    35,
    2,
    420,
    15.2,
    58.4,
    18.6,
    12.8,
    8.2,
    320.0,
    '{"meal_type": ["lunch", "dinner"], "cuisine_region": ["mediterranean"], "difficulty_level": ["intermediate"], "dietary_restrictions": ["vegetarian", "vegan", "gluten_free"]}',
    '["pot", "baking sheet", "mixing bowl"]',
    NULL
),
(
    'Salmon Teriyaki',
    'Pan-seared salmon with homemade teriyaki glaze',
    '["salmon fillet", "soy sauce", "mirin", "brown sugar", "ginger", "garlic", "sesame oil", "green onions"]',
    '["Make teriyaki sauce by combining soy sauce, mirin, and brown sugar", "Season salmon with salt and pepper", "Pan-sear salmon skin-side down first", "Glaze with teriyaki sauce", "Garnish with green onions"]',
    25,
    2,
    340,
    42.0,
    12.0,
    12.5,
    0.5,
    11.0,
    890.0,
    '{"meal_type": ["lunch", "dinner"], "cuisine_region": ["japanese"], "difficulty_level": ["intermediate"], "dietary_restrictions": ["dairy_free"]}',
    '["pan", "spatula"]',
    NULL
);

-- Verify the migration worked correctly
SELECT 
    name,
    calories,
    protein_g,
    carbs_g,
    fat_g,
    fiber_g,
    sugar_g,
    sodium_mg
FROM recipes 
LIMIT 5;
