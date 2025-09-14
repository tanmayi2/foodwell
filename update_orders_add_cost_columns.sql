-- Add missing cost columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS total_cost DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 12.50;

-- Update existing orders with realistic cost data
UPDATE orders 
SET 
  total_cost = CASE 
    WHEN total_items <= 3 THEN ROUND((RANDOM() * 30 + 20)::numeric, 2)
    WHEN total_items <= 5 THEN ROUND((RANDOM() * 50 + 40)::numeric, 2)
    WHEN total_items <= 7 THEN ROUND((RANDOM() * 70 + 60)::numeric, 2)
    ELSE ROUND((RANDOM() * 100 + 80)::numeric, 2)
  END,
  delivery_fee = CASE 
    WHEN EXTRACT(HOUR FROM created_at) BETWEEN 17 AND 20 THEN 15.00  -- Peak hours
    WHEN EXTRACT(DOW FROM created_at) IN (0, 6) THEN 14.00           -- Weekends
    ELSE 12.50                                                        -- Regular hours
  END
WHERE status = 'delivered';

-- Add comment to document the columns
COMMENT ON COLUMN orders.total_cost IS 'Total cost of items in the order';
COMMENT ON COLUMN orders.delivery_fee IS 'Fee paid to deliverer for this order';
