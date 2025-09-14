'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Calendar, Clock, Package, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface EarningsData {
  summary: {
    totalEarnings: number;
    totalOrders: number;
    averageEarningsPerOrder: number;
    period: string;
  };
  weekly: {
    earnings: number;
    orders: number;
  };
  dailyBreakdown: Array<{
    date: string;
    earnings: number;
    orders: number;
  }>;
  orders: Array<{
    id: string;
    earnings: number;
    totalCost: number;
    date: string;
    status: string;
  }>;
}

interface EarningsStats {
  periods: {
    today: { earnings: number; orders: number };
    thisWeek: { earnings: number; orders: number };
    thisMonth: { earnings: number; orders: number };
    lastMonth: { earnings: number; orders: number };
    allTime: { earnings: number; orders: number };
  };
  growth: {
    monthly: number;
  };
  averages: {
    earningsPerOrder: number;
  };
  insights: {
    bestDay: { date: string; earnings: number; orders: number } | null;
    peakHour: { hour: number; earnings: number; orders: number } | null;
  };
}

export default function EarningsSummaryPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [stats, setStats] = useState<EarningsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch main earnings data
        const earningsResponse = await fetch(`/api/delivery/earnings?period=${selectedPeriod}`);
        if (!earningsResponse.ok) {
          throw new Error('Failed to fetch earnings data');
        }
        const earningsData = await earningsResponse.json();
        setEarnings(earningsData);
        
        // Fetch earnings statistics
        const statsResponse = await fetch('/api/delivery/earnings/stats');
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch earnings statistics');
        }
        const statsData = await statsResponse.json();
        setStats(statsData);
        
      } catch (err) {
        console.error('Error fetching earnings:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [user, selectedPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading earnings data...</div>
      </div>
    );
  }

  if (!earnings || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">
          {error ? `Error: ${error}` : 'Failed to load earnings data'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Logo */}
      <div className="flex items-center justify-between">
        <Link href="/delivery" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="text-2xl font-bold text-primary">FoodWell</div>
        </Link>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-foreground">Earnings Summary</h1>
          <p className="text-muted-foreground">Track your delivery earnings and performance</p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex space-x-2">
        {['today', 'week', 'month', 'all'].map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Button>
        ))}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-600">${earnings.summary.totalEarnings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Package className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-2xl font-bold">{earnings.summary.totalOrders}</p>
              <p className="text-sm text-muted-foreground">Total Deliveries</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Star className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">5.0</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <TrendingUp className="h-8 w-8 text-accent mr-3" />
            <div>
              <p className="text-2xl font-bold">${earnings.summary.averageEarningsPerOrder.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Per Delivery</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Monthly Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">${stats.periods.thisMonth.earnings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">${stats.periods.lastMonth.earnings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Last Month</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <p className="text-2xl font-bold text-blue-600">
                  {stats.growth.monthly >= 0 ? '+' : ''}{stats.growth.monthly.toFixed(1)}%
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Growth</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earnings.dailyBreakdown.slice(-7).map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div>
                  <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">{day.orders} deliveries</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">${day.earnings.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    ${day.orders > 0 ? (day.earnings / day.orders).toFixed(2) : '0.00'} avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      {stats.insights.bestDay && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-5 w-5 text-green-600" />
                  <p className="font-medium text-green-800">Best Day</p>
                </div>
                <p className="text-sm text-green-700">
                  {new Date(stats.insights.bestDay.date).toLocaleDateString()}: 
                  ${stats.insights.bestDay.earnings.toFixed(2)} from {stats.insights.bestDay.orders} orders
                </p>
              </div>
              {stats.insights.peakHour && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <p className="font-medium text-blue-800">Peak Hour</p>
                  </div>
                  <p className="text-sm text-blue-700">
                    {stats.insights.peakHour.hour}:00 - Most productive time with 
                    ${stats.insights.peakHour.earnings.toFixed(2)} earned
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <p className="font-medium text-blue-800">Faster Deliveries</p>
              </div>
              <p className="text-sm text-blue-700">
                Complete deliveries under 90 minutes to earn bonus ratings and tips
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-800">High Ratings</p>
              </div>
              <p className="text-sm text-green-700">
                Maintain 4.8+ rating to qualify for premium delivery opportunities
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Base Rate</p>
                <p className="text-sm text-muted-foreground">Per delivery</p>
              </div>
              <p className="text-lg font-semibold">$12.50</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Next Payout</p>
                <p className="text-sm text-muted-foreground">Weekly on Fridays</p>
              </div>
              <p className="text-lg font-semibold">${earnings.weekly.earnings.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
