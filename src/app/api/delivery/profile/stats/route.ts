import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/delivery/profile/stats - Get deliverer performance statistics
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all delivered orders for statistics
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        assigned_at,
        delivered_at,
        delivery_fee,
        total_cost
      `)
      .eq('deliverer_id', user.id)
      .eq('status', 'delivered')
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Orders fetch error:', ordersError);
      return NextResponse.json({ error: 'Failed to fetch delivery statistics' }, { status: 500 });
    }

    const ordersData = orders || [];
    const now = new Date();

    // Calculate basic statistics
    const totalDeliveries = ordersData.length;
    const totalEarnings = ordersData.reduce((sum, order) => sum + (order.delivery_fee || 0), 0);
    const averageEarningsPerDelivery = totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0;

    // Calculate time-based statistics
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);
    
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayDeliveries = ordersData.filter(order => new Date(order.created_at) >= today);
    const thisWeekDeliveries = ordersData.filter(order => new Date(order.created_at) >= thisWeekStart);
    const thisMonthDeliveries = ordersData.filter(order => new Date(order.created_at) >= thisMonthStart);

    // Calculate average delivery time
    const deliveryTimes = ordersData
      .filter(order => order.assigned_at && order.delivered_at)
      .map(order => {
        const assigned = new Date(order.assigned_at);
        const delivered = new Date(order.delivered_at);
        return (delivered.getTime() - assigned.getTime()) / (1000 * 60); // minutes
      });

    const averageDeliveryTime = deliveryTimes.length > 0 
      ? deliveryTimes.reduce((sum, time) => sum + time, 0) / deliveryTimes.length 
      : 0;

    // Calculate completion rate (assuming all fetched orders are completed)
    const completionRate = 100; // Since we're only fetching delivered orders

    // Calculate peak performance hours
    const hourlyStats = ordersData.reduce((acc, order) => {
      const hour = new Date(order.created_at).getHours();
      if (!acc[hour]) {
        acc[hour] = { count: 0, earnings: 0 };
      }
      acc[hour].count += 1;
      acc[hour].earnings += order.delivery_fee || 0;
      return acc;
    }, {} as Record<number, { count: number; earnings: number }>);

    const peakHour = Object.entries(hourlyStats).reduce(
      (peak, [hour, stats]) => 
        stats.count > peak.count ? { hour: parseInt(hour), count: stats.count, earnings: stats.earnings } : peak,
      { hour: 0, count: 0, earnings: 0 }
    );

    // Calculate recent performance (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentDeliveries = ordersData.filter(order => new Date(order.created_at) >= thirtyDaysAgo);
    const recentEarnings = recentDeliveries.reduce((sum, order) => sum + (order.delivery_fee || 0), 0);

    return NextResponse.json({
      overview: {
        totalDeliveries,
        totalEarnings,
        averageEarningsPerDelivery,
        averageDeliveryTime: Math.round(averageDeliveryTime),
        completionRate,
        rating: 5.0 // Hardcoded for now
      },
      timeBasedStats: {
        today: {
          deliveries: todayDeliveries.length,
          earnings: todayDeliveries.reduce((sum, order) => sum + (order.delivery_fee || 0), 0)
        },
        thisWeek: {
          deliveries: thisWeekDeliveries.length,
          earnings: thisWeekDeliveries.reduce((sum, order) => sum + (order.delivery_fee || 0), 0)
        },
        thisMonth: {
          deliveries: thisMonthDeliveries.length,
          earnings: thisMonthDeliveries.reduce((sum, order) => sum + (order.delivery_fee || 0), 0)
        },
        last30Days: {
          deliveries: recentDeliveries.length,
          earnings: recentEarnings
        }
      },
      performance: {
        peakHour: peakHour.count > 0 ? {
          hour: peakHour.hour,
          deliveries: peakHour.count,
          earnings: peakHour.earnings
        } : null,
        averageDeliveryTime: Math.round(averageDeliveryTime),
        completionRate
      },
      recentActivity: ordersData.slice(0, 10).map(order => ({
        id: order.id,
        date: order.created_at,
        earnings: order.delivery_fee || 0,
        deliveryTime: order.assigned_at && order.delivered_at 
          ? Math.round((new Date(order.delivered_at).getTime() - new Date(order.assigned_at).getTime()) / (1000 * 60))
          : null
      }))
    });

  } catch (error) {
    console.error('Deliverer stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
