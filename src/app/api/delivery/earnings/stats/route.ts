import { NextRequest, NextResponse } from "next/server";

import { createClient } from '@/lib/supabase/server';

interface Order {
  id: string;
  total_cost: number;
  delivery_fee: number;
  created_at: string;
  status: string;
}

interface DailyStats {
  earnings: number;
  orders: number;
}

interface HourlyStats {
  earnings: number;
  orders: number;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all delivered orders for the user
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        total_cost,
        delivery_fee,
        created_at,
        status
      `)
      .eq('deliverer_id', user.id)
      .eq('status', 'delivered')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch earnings statistics" },
        { status: 500 }
      );
    }

    const now = new Date();
    const ordersData = orders || [];

    // Calculate time-based statistics
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Filter orders by time periods
    const todayOrders = ordersData.filter((order: Order) => new Date(order.created_at) >= today);
    const thisWeekOrders = ordersData.filter((order: Order) => new Date(order.created_at) >= thisWeekStart);
    const thisMonthOrders = ordersData.filter((order: Order) => new Date(order.created_at) >= thisMonthStart);
    const lastMonthOrders = ordersData.filter((order: Order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
    });

    // Calculate earnings for each period
    const calculateEarnings = (ordersList: Order[]) => 
      ordersList.reduce((sum: number, order: Order) => sum + (order.delivery_fee || 0), 0);

    const todayEarnings = calculateEarnings(todayOrders);
    const thisWeekEarnings = calculateEarnings(thisWeekOrders);
    const thisMonthEarnings = calculateEarnings(thisMonthOrders);
    const lastMonthEarnings = calculateEarnings(lastMonthOrders);
    const allTimeEarnings = calculateEarnings(ordersData);

    // Calculate growth percentages
    const monthlyGrowth =
      lastMonthEarnings > 0
        ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
        : thisMonthEarnings > 0
        ? 100
        : 0;

    // Calculate average earnings per order
    const avgEarningsPerOrder =
      ordersData.length > 0 ? allTimeEarnings / ordersData.length : 0;

    // Find best performing day
    const dailyStats = ordersData.reduce((acc: Record<string, DailyStats>, order: Order) => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { earnings: 0, orders: 0 };
      }
      acc[date].earnings += order.delivery_fee || 0;
      acc[date].orders += 1;
      return acc;
    }, {} as Record<string, DailyStats>);

    const bestDay = Object.entries(dailyStats).reduce(
      (best, [date, stats]) => 
        stats.earnings > best.earnings ? { date, earnings: stats.earnings, orders: stats.orders } : best,
      { date: '', earnings: 0, orders: 0 }
    );

    // Calculate hourly distribution (for peak hours analysis)
    const hourlyStats = ordersData.reduce((acc: Record<number, HourlyStats>, order: Order) => {
      const hour = new Date(order.created_at).getHours();
      if (!acc[hour]) {
        acc[hour] = { earnings: 0, orders: 0 };
      }
      acc[hour].earnings += order.delivery_fee || 0;
      acc[hour].orders += 1;
      return acc;
    }, {} as Record<number, HourlyStats>);

    const peakHour = Object.entries(hourlyStats).reduce(
      (peak, [hour, stats]) => 
        stats.earnings > peak.earnings ? { hour: parseInt(hour), earnings: stats.earnings, orders: stats.orders } : peak,
      { hour: 0, earnings: 0, orders: 0 }
    );

    return NextResponse.json({
      periods: {
        today: {
          earnings: todayEarnings,
          orders: todayOrders.length,
        },
        thisWeek: {
          earnings: thisWeekEarnings,
          orders: thisWeekOrders.length,
        },
        thisMonth: {
          earnings: thisMonthEarnings,
          orders: thisMonthOrders.length,
        },
        lastMonth: {
          earnings: lastMonthEarnings,
          orders: lastMonthOrders.length,
        },
        allTime: {
          earnings: allTimeEarnings,
          orders: ordersData.length,
        },
      },
      growth: {
        monthly: monthlyGrowth,
      },
      averages: {
        earningsPerOrder: avgEarningsPerOrder,
      },
      insights: {
        bestDay: bestDay.date
          ? {
              date: bestDay.date,
              earnings: bestDay.earnings,
              orders: bestDay.orders,
            }
          : null,
        peakHour:
          peakHour.earnings > 0
            ? {
                hour: peakHour.hour,
                earnings: peakHour.earnings,
                orders: peakHour.orders,
              }
            : null,
      },
      hourlyDistribution: Object.entries(hourlyStats).map(([hour, stats]) => ({
        hour: parseInt(hour),
        earnings: stats.earnings,
        orders: stats.orders
      })).sort((a, b) => a.hour - b.hour),
    });
  } catch (error) {
    console.error("Earnings stats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
