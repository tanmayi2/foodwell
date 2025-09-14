-- Update profiles table to include all user fields from JSON data
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS target_calories INTEGER DEFAULT 2000,
ADD COLUMN IF NOT EXISTS target_protein_g INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS target_carbs_g INTEGER DEFAULT 250,
ADD COLUMN IF NOT EXISTS target_fat_g INTEGER DEFAULT 70,
ADD COLUMN IF NOT EXISTS target_fiber_g INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'shopper' CHECK (role IN ('shopper', 'deliverer')),
ADD COLUMN IF NOT EXISTS liked_cuisines TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS liked_ingredients TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS disliked_cuisines TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS disliked_ingredients TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS liked_flavor_profile TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS priorities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip TEXT;

-- Update the user with email 'jparsa2006@gmail.com' with sample data from JSON
UPDATE profiles 
SET 
  name = 'Jaansi',
  dietary_restrictions = ARRAY['vegetarian'],
  allergies = ARRAY['peanuts', 'fish'],
  target_calories = 1800,
  target_protein_g = 90,
  target_carbs_g = 220,
  target_fat_g = 67,
  target_fiber_g = 25,
  role = 'shopper',
  liked_cuisines = ARRAY['chinese', 'mediterranean'],
  liked_ingredients = ARRAY['tofu', 'quinoa', 'spinach'],
  disliked_cuisines = ARRAY['mexican'],
  disliked_ingredients = ARRAY['mushrooms'],
  liked_flavor_profile = ARRAY['spicy'],
  priorities = ARRAY['health', 'sustainability'],
  address = '123 Main St',
  city = 'San Francisco',
  state = 'CA',
  zip = '94102',
  updated_at = NOW()
WHERE email = 'jparsa2006@gmail.com';

-- If the user doesn't exist yet, insert them (this will happen automatically via the trigger when they sign up)
-- But in case you want to manually insert for testing:
INSERT INTO profiles (
  id, 
  email, 
  name, 
  dietary_restrictions, 
  allergies, 
  target_calories,
  target_protein_g,
  target_carbs_g,
  target_fat_g,
  target_fiber_g,
  role,
  liked_cuisines, 
  liked_ingredients, 
  disliked_cuisines, 
  disliked_ingredients, 
  liked_flavor_profile, 
  priorities, 
  address, 
  city, 
  state, 
  zip
) 
SELECT 
  gen_random_uuid(),
  'jparsa2006@gmail.com',
  'Jaansi',
  ARRAY['vegetarian'],
  ARRAY['peanuts', 'fish'],
  1800,
  90,
  220,
  67,
  25,
  'shopper',
  ARRAY['chinese', 'mediterranean'],
  ARRAY['tofu', 'quinoa', 'spinach'],
  ARRAY['mexican'],
  ARRAY['mushrooms'],
  ARRAY['spicy'],
  ARRAY['health', 'sustainability'],
  '123 Main St',
  'San Francisco',
  'CA',
  '94102'
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'jparsa2006@gmail.com'
);
