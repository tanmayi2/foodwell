-- Update some orders to 'delivered' status so they appear in delivery history
UPDATE orders 
SET 
  status = 'delivered',
  delivered_at = NOW() - INTERVAL '1 day'
WHERE deliverer_id = '1d336116-affd-4cab-b995-3e1e05f99aa4'
  AND status = 'created'
LIMIT 3;

-- Verify the update
SELECT id, deliverer_id, status, delivered_at 
FROM orders 
WHERE deliverer_id = '1d336116-affd-4cab-b995-3e1e05f99aa4';
