'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockFridge } from '@/lib/mockData';
import { FridgeItem } from '@/types';
import { Refrigerator, Plus, Search, Package } from 'lucide-react';
import { useState } from 'react';

export default function FridgePage() {
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>(mockFridge.items);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = fridgeItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQuantityColor = (item: FridgeItem) => {
    // Simple logic to determine if quantity is low
    const isLowQuantity = item.quantity <= 2 || (item.unit === 'grams' && item.quantity <= 100);
    return isLowQuantity ? 'text-red-600' : 'text-green-600';
  };

  const getQuantityBadgeVariant = (item: FridgeItem) => {
    const isLowQuantity = item.quantity <= 2 || (item.unit === 'grams' && item.quantity <= 100);
    return isLowQuantity ? 'destructive' : 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Refrigerator className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Fridge</h1>
            <p className="text-muted-foreground">Manage your ingredients and track what you have</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Package className="h-8 w-8 text-accent mr-3" />
            <div>
              <p className="text-2xl font-bold">{fridgeItems.length}</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 font-bold text-sm">!</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {fridgeItems.filter(item => 
                  item.quantity <= 2 || (item.unit === 'grams' && item.quantity <= 100)
                ).length}
              </p>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-bold text-sm">✓</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {fridgeItems.filter(item => 
                  item.quantity > 2 && !(item.unit === 'grams' && item.quantity <= 100)
                ).length}
              </p>
              <p className="text-sm text-muted-foreground">Well Stocked</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search your fridge items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fridge Items */}
      <Card>
        <CardHeader>
          <CardTitle>Your Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium capitalize">{item.name}</h3>
                    <Badge 
                      variant={getQuantityBadgeVariant(item)}
                      className={
                        item.quantity <= 2 || (item.unit === 'grams' && item.quantity <= 100)
                          ? 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                      }
                    >
                      {item.quantity <= 2 || (item.unit === 'grams' && item.quantity <= 100) 
                        ? 'Low' 
                        : 'Good'
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-semibold ${getQuantityColor(item)}`}>
                      {item.quantity} {item.unit}
                    </span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        Use
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shopping Suggestions */}
      <Card className="bg-secondary/10 border-secondary/20">
        <CardHeader>
          <CardTitle className="text-secondary">Shopping Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary mb-4">
            Based on your low stock items, consider adding these to your shopping list:
          </p>
          <div className="flex flex-wrap gap-2">
            {fridgeItems
              .filter(item => 
                item.quantity <= 2 || (item.unit === 'grams' && item.quantity <= 100)
              )
              .map((item, index) => (
                <Badge key={index} variant="outline" className="border-secondary text-secondary">
                  {item.name}
                </Badge>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
