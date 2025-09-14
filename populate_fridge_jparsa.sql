-- Populate fridge for user with email 'jparsa2006@gmail.com' using data from fridges.json
-- This updates the existing fridge entry with the items from the JSON data

UPDATE fridges 
SET items = '[
  {
    "name": "eggs",
    "quantity": 6,
    "unit": "piece"
  },
  {
    "name": "milk",
    "quantity": 2,
    "unit": "liter"
  },
  {
    "name": "cheddar cheese",
    "quantity": 200,
    "unit": "gram"
  },
  {
    "name": "Pasta",
    "quantity": 200,
    "unit": "gram"
  },
  {
    "name": "Tomatoes",
    "quantity": 3,
    "unit": "piece"
  },
  {
    "name": "Mozzarella",
    "quantity": 150,
    "unit": "gram"
  },
  {
    "name": "Basil",
    "quantity": 10,
    "unit": "gram"
  },
  {
    "name": "Garlic",
    "quantity": 2,
    "unit": "clove"
  },
  {
    "name": "Olive Oil",
    "quantity": 2,
    "unit": "tablespoon"
  },
  {
    "name": "Salt",
    "quantity": 1,
    "unit": "teaspoon"
  }
]'::JSONB
WHERE user_id = (SELECT id FROM profiles WHERE email = 'jparsa2006@gmail.com');

-- If no fridge entry exists for this user, create one
INSERT INTO fridges (user_id, items)
SELECT 
  (SELECT id FROM profiles WHERE email = 'jparsa2006@gmail.com'),
  '[
    {
      "name": "eggs",
      "quantity": 6,
      "unit": "piece"
    },
    {
      "name": "milk",
      "quantity": 2,
      "unit": "liter"
    },
    {
      "name": "cheddar cheese",
      "quantity": 200,
      "unit": "gram"
    },
    {
      "name": "Pasta",
      "quantity": 200,
      "unit": "gram"
    },
    {
      "name": "Tomatoes",
      "quantity": 3,
      "unit": "piece"
    },
    {
      "name": "Mozzarella",
      "quantity": 150,
      "unit": "gram"
    },
    {
      "name": "Basil",
      "quantity": 10,
      "unit": "gram"
    },
    {
      "name": "Garlic",
      "quantity": 2,
      "unit": "clove"
    },
    {
      "name": "Olive Oil",
      "quantity": 2,
      "unit": "tablespoon"
    },
    {
      "name": "Salt",
      "quantity": 1,
      "unit": "teaspoon"
    }
  ]'::JSONB
WHERE NOT EXISTS (
  SELECT 1 FROM fridges WHERE user_id = (SELECT id FROM profiles WHERE email = 'jparsa2006@gmail.com')
);
