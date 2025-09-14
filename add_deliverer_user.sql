-- Add a deliverer user with email 'jaansi@berkeley.edu'
-- This creates a profile entry that will be linked when the user signs up via Supabase Auth

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
  'jaansi@berkeley.edu',
  'Jaansi (Deliverer)',
  ARRAY[]::TEXT[], -- No dietary restrictions
  ARRAY[]::TEXT[], -- No allergies
  2200, -- Higher calorie target for deliverer (more active)
  120,  -- Higher protein for active lifestyle
  275,  -- Higher carbs for energy
  80,   -- Moderate fat
  35,   -- Higher fiber
  'deliverer', -- Role set to deliverer
  ARRAY['american', 'italian']::TEXT[], -- Different cuisine preferences
  ARRAY['chicken', 'rice', 'broccoli']::TEXT[], -- Protein-focused ingredients
  ARRAY[]::TEXT[], -- No disliked cuisines
  ARRAY[]::TEXT[], -- No disliked ingredients
  ARRAY['savory', 'mild']::TEXT[], -- Different flavor profile
  ARRAY['convenience', 'energy']::TEXT[], -- Deliverer priorities
  '456 University Ave', 
  'Berkeley',
  'CA',
  '94720'
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'jaansi@berkeley.edu'
);

-- Also create corresponding user_recipes and fridges entries for the deliverer
INSERT INTO user_recipes (user_id, favorites, custom_lists)
SELECT 
  (SELECT id FROM profiles WHERE email = 'jaansi@berkeley.edu'),
  ARRAY[]::INTEGER[], -- No favorites yet
  '[]'::JSONB -- No custom lists yet
WHERE NOT EXISTS (
  SELECT 1 FROM user_recipes WHERE user_id = (SELECT id FROM profiles WHERE email = 'jaansi@berkeley.edu')
);

INSERT INTO fridges (user_id, items)
SELECT 
  (SELECT id FROM profiles WHERE email = 'jaansi@berkeley.edu'),
  '[
    {"name": "Energy Bars", "quantity": 10, "unit": "pieces", "expiry_date": "2025-02-01"},
    {"name": "Sports Drink", "quantity": 6, "unit": "bottles", "expiry_date": "2025-03-15"},
    {"name": "Instant Oatmeal", "quantity": 8, "unit": "packets", "expiry_date": "2025-06-01"}
  ]'::JSONB -- Deliverer-appropriate fridge items
WHERE NOT EXISTS (
  SELECT 1 FROM fridges WHERE user_id = (SELECT id FROM profiles WHERE email = 'jaansi@berkeley.edu')
);
