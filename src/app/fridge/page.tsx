'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockFridge } from '@/lib/mockData';
import { FridgeItem } from '@/types';
import { Ingredient, getIngredients, getDisplayName } from '@/lib/enums';
import { Refrigerator, Plus, Search, Package, Check, X, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FridgePage() {
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<{ name: string; quantity: string; unit: string }>({
    name: '',
    quantity: '',
    unit: 'piece'
  });

  // Fetch fridge data on component mount
  useEffect(() => {
    fetchFridge();
  }, []);

  const fetchFridge = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fridge/1');
      if (!response.ok) {
        throw new Error('Failed to fetch fridge data');
      }
      const fridgeData = await response.json();
      setFridgeItems(fridgeData.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Fallback to mock data if API fails
      setFridgeItems(mockFridge.items);
    } finally {
      setLoading(false);
    }
  };

  const updateFridge = async (updatedItems: FridgeItem[]) => {
    try {
      setSaving(true);
      const response = await fetch('/api/fridge/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: updatedItems }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update fridge data');
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingQuantity(fridgeItems[index].quantity.toString());
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingQuantity('');
  };

  const saveQuantity = async (index: number) => {
    const newQuantity = parseFloat(editingQuantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      setError('Please enter a valid quantity');
      return;
    }

    const updatedItems = [...fridgeItems];
    updatedItems[index] = { ...updatedItems[index], quantity: newQuantity };
    
    const success = await updateFridge(updatedItems);
    if (success) {
      setFridgeItems(updatedItems);
      setEditingIndex(null);
      setEditingQuantity('');
      setError(null);
    }
  };

  const addNewItem = async () => {
    const quantity = parseFloat(newItem.quantity);
    if (!newItem.name) {
      setError('Please select an ingredient');
      return;
    }
    if (isNaN(quantity) || quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    // Check if ingredient already exists in fridge
    const existingItemIndex = fridgeItems.findIndex(item => item.name === newItem.name);
    
    let updatedItems;
    if (existingItemIndex >= 0) {
      // If item exists, add to existing quantity
      updatedItems = [...fridgeItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
    } else {
      // If item doesn't exist, add new item
      const newFridgeItem: FridgeItem = {
        name: newItem.name,
        quantity: quantity,
        unit: newItem.unit
      };
      updatedItems = [...fridgeItems, newFridgeItem];
    }

    const success = await updateFridge(updatedItems);
    
    if (success) {
      setFridgeItems(updatedItems);
      setNewItem({ name: '', quantity: '', unit: 'piece' });
      setShowAddModal(false);
      setError(null);
    }
  };

  const resetNewItem = () => {
    setNewItem({ name: '', quantity: '', unit: 'piece' });
    setShowAddModal(false);
  };

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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading fridge...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-700 text-sm">{error}</p>
          <Button 
            onClick={() => setError(null)}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Refrigerator className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Fridge</h1>
            <p className="text-muted-foreground">Manage your ingredients and track what you have</p>
          </div>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ingredient">Ingredient</Label>
                <SearchableSelect
                  value={newItem.name}
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, name: value }))}
                  placeholder="Search and select an ingredient..."
                  options={getIngredients()
                    .sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b)))
                    .map((ingredient) => ({
                      value: ingredient,
                      label: getDisplayName(ingredient)
                    }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={newItem.unit} onValueChange={(value) => setNewItem(prev => ({ ...prev, unit: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">piece</SelectItem>
                      <SelectItem value="gram">gram</SelectItem>
                      <SelectItem value="kilogram">kilogram</SelectItem>
                      <SelectItem value="liter">liter</SelectItem>
                      <SelectItem value="milliliter">milliliter</SelectItem>
                      <SelectItem value="cup">cup</SelectItem>
                      <SelectItem value="tablespoon">tablespoon</SelectItem>
                      <SelectItem value="teaspoon">teaspoon</SelectItem>
                      <SelectItem value="clove">clove</SelectItem>
                      <SelectItem value="bunch">bunch</SelectItem>
                      <SelectItem value="can">can</SelectItem>
                      <SelectItem value="bottle">bottle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={resetNewItem} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={addNewItem} disabled={saving} className="bg-primary hover:bg-primary/90">
                  {saving ? 'Adding...' : 'Add Item'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                    {editingIndex === index ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={editingQuantity}
                          onChange={(e) => setEditingQuantity(e.target.value)}
                          className="w-20 h-8 text-sm"
                          min="0"
                          step="0.1"
                          autoFocus
                        />
                        <span className="text-sm text-gray-600">{item.unit}</span>
                      </div>
                    ) : (
                      <span className={`text-lg font-semibold ${getQuantityColor(item)}`}>
                        {item.quantity} {item.unit}
                      </span>
                    )}
                    <div className="flex space-x-1">
                      {editingIndex === index ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => saveQuantity(index)}
                            disabled={saving}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={cancelEditing}
                            disabled={saving}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => startEditing(index)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            Use
                          </Button>
                        </>
                      )}
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
