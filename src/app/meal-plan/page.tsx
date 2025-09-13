'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipeCard } from '@/components/RecipeCard';
import { useRecipes } from '@/contexts/RecipeContext';
import { mockUser, mockRecipes } from '@/lib/mockData';
import { Recipe, MealPlanEntry } from '@/types';
import { Calendar, Plus, Target, ShoppingCart, TrendingUp, Heart, BookOpen, Trash2, Edit3 } from 'lucide-react';

export default function MealPlanPage() {
  const [user] = useState(mockUser);
  const [mealPlan, setMealPlan] = useState<MealPlanEntry[]>([]);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [showCreateList, setShowCreateList] = useState(false);
  
  const {
    userRecipeData,
    toggleFavorite,
    isFavorite,
    createList,
    addToList,
    removeFromList,
    deleteList,
    getRecipesInList,
    getFavoriteRecipes
  } = useRecipes();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  const favoriteRecipes = getFavoriteRecipes(mockRecipes);

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName.trim(), newListDescription.trim() || undefined);
      setNewListName('');
      setNewListDescription('');
      setShowCreateList(false);
    }
  };

  const handleAddToList = (recipe: Recipe) => {
    // For demo, add to first list or show selection
    if (userRecipeData.custom_lists.length > 0) {
      addToList(userRecipeData.custom_lists[0].id, recipe.id);
      alert(`Added "${recipe.name}" to "${userRecipeData.custom_lists[0].name}"!`);
    } else {
      alert('Create a list first!');
    }
  };

  const addToMealPlan = (recipe: Recipe, day: string, mealType: typeof mealTypes[number]) => {
    const newEntry: MealPlanEntry = {
      id: `${Date.now()}-${Math.random()}`,
      recipe,
      day,
      meal_type: mealType,
      servings: 1
    };
    setMealPlan(prev => [...prev, newEntry]);
  };

  const removeFromMealPlan = (entryId: string) => {
    setMealPlan(prev => prev.filter(entry => entry.id !== entryId));
  };

  const updateServings = (entryId: string, servings: number) => {
    setMealPlan(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, servings } : entry
    ));
  };

  // Calculate total macros for the week
  const calculateTotalMacros = () => {
    return mealPlan.reduce((totals, entry) => {
      const recipe = entry.recipe;
      const multiplier = entry.servings / recipe.num_servings;
      
      return {
        calories: totals.calories + (recipe.macros.calories * multiplier),
        protein_g: totals.protein_g + (recipe.macros.protein_g * multiplier),
        carbs_g: totals.carbs_g + (recipe.macros.carbs_g * multiplier),
        fat_g: totals.fat_g + (recipe.macros.fat_g * multiplier),
        fiber_g: totals.fiber_g + (recipe.macros.fiber_g * multiplier)
      };
    }, { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0 });
  };

  // Calculate daily averages
  const totalMacros = calculateTotalMacros();
  const dailyAverages = {
    calories: Math.round(totalMacros.calories / 7),
    protein_g: Math.round(totalMacros.protein_g / 7),
    carbs_g: Math.round(totalMacros.carbs_g / 7),
    fat_g: Math.round(totalMacros.fat_g / 7),
    fiber_g: Math.round(totalMacros.fiber_g / 7)
  };

  // Calculate percentage of targets met
  const getTargetPercentage = (actual: number, target: number) => {
    return Math.round((actual / target) * 100);
  };

  // Generate grocery list
  const generateGroceryList = () => {
    const ingredientMap = new Map<string, { quantity: number; unit: string }>();
    
    mealPlan.forEach(entry => {
      const multiplier = entry.servings / entry.recipe.num_servings;
      entry.recipe.ingredients.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        const adjustedQuantity = ingredient.quantity * multiplier;
        
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          // Simple addition - in real app, would need unit conversion
          if (existing.unit === ingredient.unit) {
            existing.quantity += adjustedQuantity;
          }
        } else {
          ingredientMap.set(key, {
            quantity: adjustedQuantity,
            unit: ingredient.unit
          });
        }
      });
    });

    return Array.from(ingredientMap.entries()).map(([name, details]) => ({
      name,
      quantity: Math.round(details.quantity * 10) / 10, // Round to 1 decimal
      unit: details.unit
    }));
  };

  const groceryList = generateGroceryList();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meal Plan</h1>
            <p className="text-gray-600">Plan your weekly meals and track your nutrition</p>
          </div>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Generate Shopping List
        </Button>
      </div>

      <Tabs defaultValue="recipes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recipes">My Recipes</TabsTrigger>
          <TabsTrigger value="planner">Weekly Planner</TabsTrigger>
          <TabsTrigger value="grocery">Shopping List</TabsTrigger>
        </TabsList>

        <TabsContent value="recipes" className="space-y-6">
          {/* Favorites Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <span>Favorite Recipes ({favoriteRecipes.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteRecipes.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No favorite recipes yet. Heart some recipes to see them here!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favoriteRecipes.map(recipe => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={true}
                      onToggleFavorite={(recipe) => toggleFavorite(recipe.id)}
                      onAddToMealPlan={(recipe: Recipe) => {
                        // Simple add to Monday breakfast for demo
                        addToMealPlan(recipe, 'Monday', 'breakfast');
                        alert(`Added "${recipe.name}" to Monday breakfast!`);
                      }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Lists Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>My Recipe Lists ({userRecipeData.custom_lists.length})</span>
                </div>
                <Button onClick={() => setShowCreateList(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New List
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showCreateList && (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Label htmlFor="listName">List Name</Label>
                      <Input
                        id="listName"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="e.g., Quick Weeknight Meals"
                      />
                    </div>
                    <div>
                      <Label htmlFor="listDescription">Description (optional)</Label>
                      <Input
                        id="listDescription"
                        value={newListDescription}
                        onChange={(e) => setNewListDescription(e.target.value)}
                        placeholder="e.g., Recipes that take 30 minutes or less"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateList} size="sm">
                        Create List
                      </Button>
                      <Button onClick={() => setShowCreateList(false)} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {userRecipeData.custom_lists.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No custom lists yet. Create your first list to organize recipes!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userRecipeData.custom_lists.map(list => {
                    const listRecipes = getRecipesInList(list.id, mockRecipes);
                    return (
                      <Card key={list.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{list.name}</CardTitle>
                              {list.description && (
                                <p className="text-sm text-gray-600 mt-1">{list.description}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {listRecipes.length} recipe{listRecipes.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <Button
                              onClick={() => deleteList(list.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {listRecipes.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recipes in this list yet.</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {listRecipes.map(recipe => (
                                <div key={recipe.id} className="relative">
                                  <RecipeCard
                                    recipe={recipe}
                                    isFavorite={isFavorite(recipe.id)}
                                    onToggleFavorite={(recipe) => toggleFavorite(recipe.id)}
                                    onAddToMealPlan={(recipe: Recipe) => {
                                      addToMealPlan(recipe, 'Monday', 'breakfast');
                                      alert(`Added "${recipe.name}" to Monday breakfast!`);
                                    }}
                                    showAddButton={false}
                                  />
                                  <Button
                                    onClick={() => removeFromList(list.id, recipe.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-2 right-2 h-6 w-6 p-0 bg-white/90 hover:bg-white text-red-600"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planner" className="space-y-6">
          {/* Quick Add Section */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Add Recipes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {favoriteRecipes.slice(0, 3).map((recipe: Recipe) => (
                  <div key={recipe.id} className="relative">
                    <RecipeCard recipe={recipe} showAddButton={false} />
                    <div className="absolute bottom-2 right-2">
                      <select 
                        className="text-xs border rounded px-2 py-1"
                        onChange={(e) => {
                          const [day, mealType] = e.target.value.split('-');
                          if (day && mealType) {
                            addToMealPlan(recipe, day, mealType as typeof mealTypes[number]);
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="">Add to...</option>
                        {daysOfWeek.map(day => 
                          mealTypes.map(meal => (
                            <option key={`${day}-${meal}`} value={`${day}-${meal}`}>
                              {day} - {meal}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {daysOfWeek.map(day => (
              <Card key={day} className="min-h-[400px]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{day}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mealTypes.map(mealType => {
                    const mealsForDayAndType = mealPlan.filter(
                      entry => entry.day === day && entry.meal_type === mealType
                    );
                    
                    return (
                      <div key={mealType} className="space-y-2">
                        <h4 className="font-medium text-sm capitalize text-gray-700">
                          {mealType}
                        </h4>
                        {mealsForDayAndType.length === 0 ? (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center">
                            <Plus className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-400">Add meal</p>
                          </div>
                        ) : (
                          mealsForDayAndType.map(entry => (
                            <div key={entry.id} className="bg-gray-50 rounded-lg p-2 text-xs">
                              <div className="flex justify-between items-start mb-1">
                                <p className="font-medium">{entry.recipe.name}</p>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-4 w-4 p-0"
                                  onClick={() => removeFromMealPlan(entry.id)}
                                >
                                  ×
                                </Button>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-gray-600">
                                  {Math.round((entry.recipe.macros.calories * entry.servings) / entry.recipe.num_servings)} cal
                                </p>
                                <select
                                  value={entry.servings}
                                  onChange={(e) => updateServings(entry.id, parseInt(e.target.value))}
                                  className="text-xs border rounded px-1"
                                >
                                  {[1, 2, 3, 4].map(num => (
                                    <option key={num} value={num}>{num} serving{num > 1 ? 's' : ''}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
          {/* Macro Targets vs Actual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Daily Nutrition Targets vs Actual</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  { label: 'Calories', actual: dailyAverages.calories, target: user.macro_targets.calories, color: 'orange' },
                  { label: 'Protein', actual: dailyAverages.protein_g, target: user.macro_targets.protein_g, color: 'green', unit: 'g' },
                  { label: 'Carbs', actual: dailyAverages.carbs_g, target: user.macro_targets.carbs_g, color: 'blue', unit: 'g' },
                  { label: 'Fat', actual: dailyAverages.fat_g, target: user.macro_targets.fat_g, color: 'yellow', unit: 'g' },
                  { label: 'Fiber', actual: dailyAverages.fiber_g, target: user.macro_targets.fiber_g, color: 'purple', unit: 'g' }
                ].map(macro => {
                  const percentage = getTargetPercentage(macro.actual, macro.target);
                  const isOnTarget = percentage >= 90 && percentage <= 110;
                  
                  return (
                    <div key={macro.label} className="text-center space-y-2">
                      <h4 className="font-medium text-gray-900">{macro.label}</h4>
                      <div className="space-y-1">
                        <p className={`text-2xl font-bold text-${macro.color}-600`}>
                          {macro.actual}{macro.unit || ''}
                        </p>
                        <p className="text-sm text-gray-500">
                          Target: {macro.target}{macro.unit || ''}
                        </p>
                        <Badge 
                          variant={isOnTarget ? "default" : percentage < 90 ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Weekly Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{mealPlan.length}</p>
                  <p className="text-sm text-gray-600">Planned Meals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{Math.round(totalMacros.calories)}</p>
                  <p className="text-sm text-gray-600">Total Calories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(totalMacros.protein_g)}g
                  </p>
                  <p className="text-sm text-gray-600">Total Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {new Set(mealPlan.map(entry => entry.recipe.id)).size}
                  </p>
                  <p className="text-sm text-gray-600">Unique Recipes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grocery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <span>Shopping List</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {groceryList.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Add meals to your plan to generate a shopping list</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groceryList.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.quantity} {item.unit}</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
