-- Insert sample recipes (based on your existing data structure)
INSERT INTO recipes (id, name, description, instructions, ingredients, time_minutes, num_servings, macros, tags, equipment_needed, thumbnail) VALUES
(301, 'Grilled Chicken Salad', 'A healthy and protein-rich salad with grilled chicken breast, mixed greens, and a light vinaigrette.', 
 '["Season chicken breast with salt, pepper, and herbs", "Grill chicken for 6-7 minutes per side until cooked through", "Let chicken rest for 5 minutes, then slice", "Toss mixed greens with vinaigrette", "Top salad with sliced chicken and serve"]',
 '[{"name": "chicken breast", "amount": 6, "unit": "oz"}, {"name": "mixed greens", "amount": 4, "unit": "cups"}, {"name": "olive oil", "amount": 2, "unit": "tbsp"}, {"name": "lemon juice", "amount": 1, "unit": "tbsp"}, {"name": "salt", "amount": 0.5, "unit": "tsp"}, {"name": "black pepper", "amount": 0.25, "unit": "tsp"}]',
 25, 2, 
 '{"calories": 320, "protein_g": 35, "carbs_g": 8, "fat_g": 14, "fiber_g": 4}',
 '{"meal_type": ["lunch", "dinner"], "cuisine_region": ["american"], "difficulty_level": ["easy"], "dietary_restrictions": ["gluten-free", "dairy-free"]}',
 '["grill", "mixing bowl"]', null),

(302, 'Vegetable Stir Fry', 'Quick and colorful vegetable stir fry with a savory sauce.',
 '["Heat oil in wok or large skillet over high heat", "Add garlic and ginger, stir fry for 30 seconds", "Add harder vegetables first (carrots, broccoli), stir fry 2-3 minutes", "Add softer vegetables (bell peppers, snap peas), stir fry 2 minutes", "Add sauce and toss to coat", "Serve immediately over rice"]',
 '[{"name": "mixed vegetables", "amount": 4, "unit": "cups"}, {"name": "garlic", "amount": 3, "unit": "cloves"}, {"name": "ginger", "amount": 1, "unit": "tbsp"}, {"name": "soy sauce", "amount": 3, "unit": "tbsp"}, {"name": "sesame oil", "amount": 1, "unit": "tbsp"}, {"name": "vegetable oil", "amount": 2, "unit": "tbsp"}]',
 15, 3,
 '{"calories": 180, "protein_g": 6, "carbs_g": 22, "fat_g": 8, "fiber_g": 6}',
 '{"meal_type": ["lunch", "dinner"], "cuisine_region": ["asian"], "difficulty_level": ["easy"], "dietary_restrictions": ["vegetarian", "vegan"]}',
 '["wok", "cutting board"]', null),

(303, 'Salmon with Quinoa', 'Baked salmon served with fluffy quinoa and steamed vegetables.',
 '["Preheat oven to 400°F", "Season salmon with salt, pepper, and lemon", "Bake salmon for 12-15 minutes", "Meanwhile, cook quinoa according to package directions", "Steam vegetables until tender", "Serve salmon over quinoa with vegetables on the side"]',
 '[{"name": "salmon fillet", "amount": 6, "unit": "oz"}, {"name": "quinoa", "amount": 1, "unit": "cup"}, {"name": "broccoli", "amount": 2, "unit": "cups"}, {"name": "lemon", "amount": 1, "unit": "whole"}, {"name": "olive oil", "amount": 1, "unit": "tbsp"}, {"name": "salt", "amount": 0.5, "unit": "tsp"}]',
 30, 2,
 '{"calories": 450, "protein_g": 38, "carbs_g": 35, "fat_g": 18, "fiber_g": 8}',
 '{"meal_type": ["dinner"], "cuisine_region": ["mediterranean"], "difficulty_level": ["intermediate"], "dietary_restrictions": ["gluten-free", "dairy-free"]}',
 '["baking sheet", "saucepan", "steamer"]', null),

(304, 'Greek Yogurt Parfait', 'Layered parfait with Greek yogurt, berries, and granola.',
 '["Layer Greek yogurt in a glass or bowl", "Add a layer of mixed berries", "Sprinkle granola on top", "Repeat layers as desired", "Drizzle with honey if desired", "Serve immediately"]',
 '[{"name": "Greek yogurt", "amount": 1, "unit": "cup"}, {"name": "mixed berries", "amount": 0.5, "unit": "cup"}, {"name": "granola", "amount": 0.25, "unit": "cup"}, {"name": "honey", "amount": 1, "unit": "tbsp"}]',
 5, 1,
 '{"calories": 280, "protein_g": 20, "carbs_g": 35, "fat_g": 8, "fiber_g": 5}',
 '{"meal_type": ["breakfast", "snack"], "cuisine_region": ["mediterranean"], "difficulty_level": ["easy"], "dietary_restrictions": ["vegetarian", "gluten-free"]}',
 '["mixing bowl"]', null);
