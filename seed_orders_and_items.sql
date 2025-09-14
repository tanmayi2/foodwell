-- First create the orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shopper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    deliverer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    delivery_address TEXT NOT NULL,
    delivery_instructions TEXT,
    total_items INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('created', 'assigned', 'shopping', 'en_route', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (
        auth.uid() = shopper_id OR 
        auth.uid() = deliverer_id
    );

CREATE POLICY "Shoppers can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = shopper_id);

CREATE POLICY "Shoppers and deliverers can update orders" ON orders
    FOR UPDATE USING (
        auth.uid() = shopper_id OR 
        auth.uid() = deliverer_id
    );

-- Create indexes for orders table
CREATE INDEX IF NOT EXISTS idx_orders_shopper_id ON orders(shopper_id);
CREATE INDEX IF NOT EXISTS idx_orders_deliverer_id ON orders(deliverer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Insert completed orders with realistic delivery addresses
WITH order_data AS (
  SELECT 
    gen_random_uuid() as order_id,
    'b3f75058-ba13-4a9d-86eb-2313c57d8343'::uuid as shopper_id,
    '1d336116-affd-4cab-b995-3e1e05f99aa4'::uuid as deliverer_id,
    'delivered' as status,
    NOW() - INTERVAL '5 days' as created_at,
    NOW() - INTERVAL '5 days' + INTERVAL '30 minutes' as assigned_at,
    NOW() - INTERVAL '5 days' + INTERVAL '2 hours' as delivered_at
  UNION ALL
  SELECT 
    gen_random_uuid() as order_id,
    'b3f75058-ba13-4a9d-86eb-2313c57d8343'::uuid as shopper_id,
    '1d336116-affd-4cab-b995-3e1e05f99aa4'::uuid as deliverer_id,
    'delivered' as status,
    NOW() - INTERVAL '3 days' as created_at,
    NOW() - INTERVAL '3 days' + INTERVAL '15 minutes' as assigned_at,
    NOW() - INTERVAL '3 days' + INTERVAL '1.5 hours' as delivered_at
  UNION ALL
  SELECT 
    gen_random_uuid() as order_id,
    'b3f75058-ba13-4a9d-86eb-2313c57d8343'::uuid as shopper_id,
    '1d336116-affd-4cab-b995-3e1e05f99aa4'::uuid as deliverer_id,
    'delivered' as status,
    NOW() - INTERVAL '1 day' as created_at,
    NOW() - INTERVAL '1 day' + INTERVAL '45 minutes' as assigned_at,
    NOW() - INTERVAL '1 day' + INTERVAL '2.5 hours' as delivered_at
  UNION ALL
  SELECT 
    gen_random_uuid() as order_id,
    'b3f75058-ba13-4a9d-86eb-2313c57d8343'::uuid as shopper_id,
    '1d336116-affd-4cab-b995-3e1e05f99aa4'::uuid as deliverer_id,
    'delivered' as status,
    NOW() - INTERVAL '7 days' as created_at,
    NOW() - INTERVAL '7 days' + INTERVAL '20 minutes' as assigned_at,
    NOW() - INTERVAL '7 days' + INTERVAL '1.8 hours' as delivered_at
  UNION ALL
  SELECT 
    gen_random_uuid() as order_id,
    'b3f75058-ba13-4a9d-86eb-2313c57d8343'::uuid as shopper_id,
    '1d336116-affd-4cab-b995-3e1e05f99aa4'::uuid as deliverer_id,
    'delivered' as status,
    NOW() - INTERVAL '10 days' as created_at,
    NOW() - INTERVAL '10 days' + INTERVAL '25 minutes' as assigned_at,
    NOW() - INTERVAL '10 days' + INTERVAL '2.2 hours' as delivered_at
),
inserted_orders AS (
  INSERT INTO orders (id, shopper_id, deliverer_id, delivery_address, delivery_instructions, total_items, status, created_at, assigned_at, delivered_at)
  SELECT 
    order_id,
    shopper_id,
    deliverer_id,
    CASE 
      WHEN ROW_NUMBER() OVER() = 1 THEN '123 Main St, Berkeley, CA 94704'
      WHEN ROW_NUMBER() OVER() = 2 THEN '456 Telegraph Ave, Berkeley, CA 94704'
      WHEN ROW_NUMBER() OVER() = 3 THEN '789 University Ave, Berkeley, CA 94704'
      WHEN ROW_NUMBER() OVER() = 4 THEN '321 Shattuck Ave, Berkeley, CA 94704'
      ELSE '654 College Ave, Berkeley, CA 94704'
    END as delivery_address,
    CASE 
      WHEN ROW_NUMBER() OVER() = 1 THEN 'Leave at front door, ring doorbell'
      WHEN ROW_NUMBER() OVER() = 2 THEN 'Apartment 2B, use buzzer'
      WHEN ROW_NUMBER() OVER() = 3 THEN 'Call when you arrive'
      WHEN ROW_NUMBER() OVER() = 4 THEN 'Leave with concierge'
      ELSE 'Ring doorbell twice'
    END as delivery_instructions,
    CASE 
      WHEN ROW_NUMBER() OVER() = 1 THEN 4
      WHEN ROW_NUMBER() OVER() = 2 THEN 6
      WHEN ROW_NUMBER() OVER() = 3 THEN 3
      WHEN ROW_NUMBER() OVER() = 4 THEN 5
      ELSE 7
    END as total_items,
    status,
    created_at,
    assigned_at,
    delivered_at
  FROM order_data
  RETURNING id, created_at
)

-- Insert items for each order
INSERT INTO items_request (order_id, ingredient, quantity, unit, shopper_id, deliverer_id, status, created_at, updated_at)
SELECT 
  o.id as order_id,
  items.ingredient,
  items.quantity,
  items.unit,
  'b3f75058-ba13-4a9d-86eb-2313c57d8343'::uuid as shopper_id,
  '1d336116-affd-4cab-b995-3e1e05f99aa4'::uuid as deliverer_id,
  'completed' as status,
  o.created_at,
  o.created_at + INTERVAL '2 hours' as updated_at
FROM inserted_orders o
CROSS JOIN LATERAL (
  VALUES 
    -- Order 1 items (Italian dinner)
    (CASE WHEN ROW_NUMBER() OVER() = 1 THEN 'tomatoes' END, 
     CASE WHEN ROW_NUMBER() OVER() = 1 THEN 2.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 1 THEN 'kilogram' END),
    (CASE WHEN ROW_NUMBER() OVER() = 1 THEN 'pasta' END,
     CASE WHEN ROW_NUMBER() OVER() = 1 THEN 500.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 1 THEN 'gram' END),
    (CASE WHEN ROW_NUMBER() OVER() = 1 THEN 'basil' END,
     CASE WHEN ROW_NUMBER() OVER() = 1 THEN 1.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 1 THEN 'bunch' END),
    (CASE WHEN ROW_NUMBER() OVER() = 1 THEN 'mozzarella cheese' END,
     CASE WHEN ROW_NUMBER() OVER() = 1 THEN 250.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 1 THEN 'gram' END),
    
    -- Order 2 items (Asian stir-fry)
    (CASE WHEN ROW_NUMBER() OVER() = 2 THEN 'chicken breast' END,
     CASE WHEN ROW_NUMBER() OVER() = 2 THEN 1.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 2 THEN 'kilogram' END),
    (CASE WHEN ROW_NUMBER() OVER() = 2 THEN 'broccoli' END,
     CASE WHEN ROW_NUMBER() OVER() = 2 THEN 500.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 2 THEN 'gram' END),
    (CASE WHEN ROW_NUMBER() OVER() = 2 THEN 'soy sauce' END,
     CASE WHEN ROW_NUMBER() OVER() = 2 THEN 1.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 2 THEN 'bottle' END),
    (CASE WHEN ROW_NUMBER() OVER() = 2 THEN 'rice' END,
     CASE WHEN ROW_NUMBER() OVER() = 2 THEN 1.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 2 THEN 'kilogram' END),
    (CASE WHEN ROW_NUMBER() OVER() = 2 THEN 'ginger' END,
     CASE WHEN ROW_NUMBER() OVER() = 2 THEN 100.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 2 THEN 'gram' END),
    (CASE WHEN ROW_NUMBER() OVER() = 2 THEN 'garlic' END,
     CASE WHEN ROW_NUMBER() OVER() = 2 THEN 3.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 2 THEN 'clove' END),
    
    -- Order 3 items (Mexican tacos)
    (CASE WHEN ROW_NUMBER() OVER() = 3 THEN 'ground beef' END,
     CASE WHEN ROW_NUMBER() OVER() = 3 THEN 500.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 3 THEN 'gram' END),
    (CASE WHEN ROW_NUMBER() OVER() = 3 THEN 'tortillas' END,
     CASE WHEN ROW_NUMBER() OVER() = 3 THEN 8.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 3 THEN 'piece' END),
    (CASE WHEN ROW_NUMBER() OVER() = 3 THEN 'lettuce' END,
     CASE WHEN ROW_NUMBER() OVER() = 3 THEN 1.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 3 THEN 'piece' END),
    
    -- Order 4 items (Breakfast)
    (CASE WHEN ROW_NUMBER() OVER() = 4 THEN 'eggs' END,
     CASE WHEN ROW_NUMBER() OVER() = 4 THEN 12.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 4 THEN 'piece' END),
    (CASE WHEN ROW_NUMBER() OVER() = 4 THEN 'bacon' END,
     CASE WHEN ROW_NUMBER() OVER() = 4 THEN 300.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 4 THEN 'gram' END),
    (CASE WHEN ROW_NUMBER() OVER() = 4 THEN 'bread' END,
     CASE WHEN ROW_NUMBER() OVER() = 4 THEN 1.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 4 THEN 'piece' END),
    (CASE WHEN ROW_NUMBER() OVER() = 4 THEN 'butter' END,
     CASE WHEN ROW_NUMBER() OVER() = 4 THEN 250.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 4 THEN 'gram' END),
    (CASE WHEN ROW_NUMBER() OVER() = 4 THEN 'orange juice' END,
     CASE WHEN ROW_NUMBER() OVER() = 4 THEN 1.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 4 THEN 'liter' END),
    
    -- Order 5 items (Healthy salad)
    (CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'spinach' END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 200.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'gram' END),
    (CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'avocado' END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 2.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'piece' END),
    (CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'salmon fillet' END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 400.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'gram' END),
    (CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'olive oil' END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 250.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'milliliter' END),
    (CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'lemon' END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 2.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'piece' END),
    (CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'cherry tomatoes' END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 300.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'gram' END),
    (CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'cucumber' END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 1.0 END,
     CASE WHEN ROW_NUMBER() OVER() = 5 THEN 'piece' END)
) AS items(ingredient, quantity, unit)
WHERE items.ingredient IS NOT NULL;
