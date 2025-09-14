import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface Order {
  id: string;
  total_cost: number;
  delivery_fee: number;
  created_at: string;
  status: string;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters for date filtering
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'today', 'week', 'month', 'all'

    // Calculate date range based on period
    let dateFilter = '';
    const now = new Date();
    
    switch (period) {
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        dateFilter = `AND o.created_at >= '${today.toISOString()}'`;
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = `AND o.created_at >= '${weekAgo.toISOString()}'`;
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = `AND o.created_at >= '${monthAgo.toISOString()}'`;
        break;
      default:
        dateFilter = '';
    }

    // Query to get earnings summary
    const { data: earningsData, error } = await supabase
      .from('orders')
      .select(`
        id,
        total_cost,
        delivery_fee,
        created_at,
        status
      `)
      .eq('deliverer_id', user.id)
      .eq('status', 'delivered');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch earnings data' }, { status: 500 });
    }

    // Filter by date period if specified
    let filteredData = earningsData || [];
    if (period !== 'all') {
      const now = new Date();
      let cutoffDate: Date;
      
      switch (period) {
        case 'today':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }
      
      filteredData = earningsData.filter((order: Order) => 
        new Date(order.created_at) >= cutoffDate
      );
    }

    // Calculate earnings metrics
    const totalEarnings = filteredData.reduce((sum: number, order: Order) => sum + (order.delivery_fee || 0), 0);
    const totalOrders = filteredData.length;
    const averageEarningsPerOrder = totalOrders > 0 ? totalEarnings / totalOrders : 0;

    // Calculate daily breakdown for charts
    const dailyEarnings = filteredData.reduce((acc: Record<string, { date: string; earnings: number; orders: number }>, order: Order) => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, earnings: 0, orders: 0 };
      }
      acc[date].earnings += order.delivery_fee || 0;
      acc[date].orders += 1;
      return acc;
    }, {} as Record<string, { date: string; earnings: number; orders: number }>);

    const dailyBreakdown = Object.values(dailyEarnings).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate weekly summary for the current week
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyOrders = earningsData.filter((order: Order) => 
      new Date(order.created_at) >= startOfWeek
    );
    const weeklyEarnings = weeklyOrders.reduce((sum: number, order: Order) => sum + (order.delivery_fee || 0), 0);

    return NextResponse.json({
      summary: {
        totalEarnings,
        totalOrders,
        averageEarningsPerOrder,
        period
      },
      weekly: {
        earnings: weeklyEarnings,
        orders: weeklyOrders.length
      },
      dailyBreakdown,
      orders: filteredData.map((order: Order) => ({
        id: order.id,
        earnings: order.delivery_fee || 0,
        totalCost: order.total_cost,
        date: order.created_at,
        status: order.status
      }))
    });

  } catch (error) {
    console.error('Earnings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
