'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, MapPin, Clock, DollarSign, Package, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Order {
  id: string;
  delivery_address: string;
  delivery_instructions: string;
  total_items: number;
  status: string;
  created_at: string;
  assigned_at: string;
  delivered_at: string;
  items: Array<{
    ingredient: string;
    quantity: number;
    unit: string;
  }>;
}

export default function DeliveryHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDeliveryHistory = async () => {
      if (!user) {
        console.log('DeliveryHistory: No user, skipping fetch');
        return;
      }
      
      try {
        setLoading(true);
        console.log('DeliveryHistory: Fetching delivery history...');
        const response = await fetch('/api/delivery/history');
        console.log('DeliveryHistory: Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch delivery history: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('DeliveryHistory: API response data:', data);
        console.log('DeliveryHistory: Orders array:', data.orders);
        console.log('DeliveryHistory: Orders length:', data.orders?.length || 0);
        
        setOrders(data.orders || []);
      } catch (err) {
        console.error('DeliveryHistory: Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryHistory();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDeliveryTime = (assignedAt: string, deliveredAt: string) => {
    const assigned = new Date(assignedAt);
    const delivered = new Date(deliveredAt);
    const diffInMinutes = Math.floor((delivered.getTime() - assigned.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading delivery history...</div>
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
          <h1 className="text-3xl font-bold text-foreground">Delivery History</h1>
          <p className="text-muted-foreground">View your completed deliveries and performance</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Package className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm text-muted-foreground">Total Deliveries</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="h-8 w-8 text-accent mr-3" />
            <div>
              <p className="text-2xl font-bold">
                {orders.length > 0 
                  ? Math.round(orders.reduce((acc, order) => {
                      const assigned = new Date(order.assigned_at);
                      const delivered = new Date(order.delivered_at);
                      return acc + (delivered.getTime() - assigned.getTime()) / (1000 * 60);
                    }, 0) / orders.length)
                  : 0}m
              </p>
              <p className="text-sm text-muted-foreground">Avg Delivery Time</p>
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
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">${(orders.length * 12.5).toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No deliveries found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Delivered
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(order.delivered_at)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                        <MapPin className="h-4 w-4" />
                        <span>{order.delivery_address}</span>
                      </div>
                      {order.delivery_instructions && (
                        <p className="text-sm text-muted-foreground italic">
                          &quot;{order.delivery_instructions}&quot;
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">$12.50</div>
                      <div className="text-sm text-muted-foreground">
                        {calculateDeliveryTime(order.assigned_at, order.delivered_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {order.total_items} items delivered
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {order.items?.slice(0, 3).map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item.quantity} {item.unit} {item.ingredient}
                            </Badge>
                          ))}
                          {order.items?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{order.items.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
