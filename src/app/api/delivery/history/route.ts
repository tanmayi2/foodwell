import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET /api/delivery/history - Get delivery history for the logged-in deliverer
export async function GET() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  try {
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is a deliverer
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'deliverer') {
      return NextResponse.json({ error: 'Access denied - deliverer role required' }, { status: 403 })
    }

    // Get delivery history for this deliverer
    console.log('API: Querying orders for deliverer_id:', user.id)
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        shopper_id,
        delivery_address,
        delivery_instructions,
        total_cost,
        status,
        created_at,
        delivered_at,
        order_items (
          id,
          name,
          quantity,
          unit,
          price_per_unit
        )
      `)
      .eq('deliverer_id', user.id)
      .eq('status', 'delivered')
      .order('delivered_at', { ascending: false })
    
    console.log('API: Query executed, orders result:', orders)
    console.log('API: Query error:', ordersError)

    // Debug: Check if there are any orders at all
    const { data: allOrders, error: allOrdersError } = await supabase
      .from('orders')
      .select('id, deliverer_id, status')
      .limit(10)
    
    console.log('API: All orders in database (first 10):', allOrders)
    console.log('API: All orders error:', allOrdersError)

    if (ordersError) {
      console.error('Orders fetch error:', ordersError)
      return NextResponse.json({ error: 'Failed to fetch delivery history' }, { status: 500 })
    }

    // Calculate summary statistics
    const totalDeliveries = orders.length
    const totalEarnings = 0 // No delivery_fee column in schema, set to 0 for now
    const averageOrderValue = orders.length > 0 
      ? orders.reduce((sum, order) => sum + order.total_cost, 0) / orders.length 
      : 0

    // Get customer names for the orders
    const shopperIds = [...new Set(orders.map(order => order.shopper_id))]
    const { data: customers, error: customersError } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', shopperIds)

    if (customersError) {
      console.error('Customers fetch error:', customersError)
    }

    // Create a map of customer names
    const customerMap = new Map()
    customers?.forEach(customer => {
      customerMap.set(customer.id, customer.name || 'Unknown Customer')
    })

    // Add customer names to orders
    const ordersWithCustomers = orders.map(order => ({
      ...order,
      customer_name: customerMap.get(order.shopper_id) || 'Unknown Customer'
    }))

    return NextResponse.json({
      orders: ordersWithCustomers,
      summary: {
        totalDeliveries,
        totalEarnings,
        averageOrderValue
      }
    })
  } catch (error) {
    console.error('Delivery history API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
