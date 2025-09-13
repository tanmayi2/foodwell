'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/RecipeCard';
import { mockRecipes, getRecommendedRecipes } from '@/lib/mockData';
import { Recipe, User } from '@/types';
import { Heart, Star, TrendingUp, Clock } from 'lucide-react';

export default function RecommendationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users/1');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUser(userData);
        setRecommendedRecipes(getRecommendedRecipes(userData, mockRecipes));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddToMealPlan = (recipe: Recipe) => {
    console.log('Adding to meal plan:', recipe.name);
    alert(`Added "${recipe.name}" to meal plan!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading recommendations</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">No user data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Heart className="h-8 w-8 text-red-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recommendations</h1>
          <p className="text-gray-600">Personalized recipes just for you, {user.name}</p>
        </div>
      </div>

      {/* User Preferences Summary */}
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-red-600" />
            <span>Your Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Dietary Restrictions</h4>
              <div className="flex flex-wrap gap-1">
                {user.dietary_restrictions.map(restriction => (
                  <Badge key={restriction} variant="secondary" className="bg-green-100 text-green-800">
                    {restriction}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Allergies</h4>
              <div className="flex flex-wrap gap-1">
                {user.allergies.map(allergy => (
                  <Badge key={allergy} variant="destructive">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Liked Cuisines</h4>
              <div className="flex flex-wrap gap-1">
                {user.liked_cuisines.map(cuisine => (
                  <Badge key={cuisine} variant="outline" className="border-blue-300 text-blue-700">
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Flavor Preferences</h4>
              <div className="flex flex-wrap gap-1">
                {user.liked_flavor_profile.map(flavor => (
                  <Badge key={flavor} variant="outline" className="border-purple-300 text-purple-700">
                    {flavor}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macro Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Your Daily Macro Targets</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{user.macro_targets.calories}</p>
              <p className="text-sm text-gray-600">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{user.macro_targets.protein_g}g</p>
              <p className="text-sm text-gray-600">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{user.macro_targets.carbs_g}g</p>
              <p className="text-sm text-gray-600">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{user.macro_targets.fat_g}g</p>
              <p className="text-sm text-gray-600">Fat</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{user.macro_targets.fiber_g}g</p>
              <p className="text-sm text-gray-600">Fiber</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Heart className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{recommendedRecipes.length}</p>
              <p className="text-sm text-gray-600">Recommended Recipes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">
                {Math.round(recommendedRecipes.reduce((acc, recipe) => acc + recipe.time_minutes, 0) / recommendedRecipes.length || 0)}m
              </p>
              <p className="text-sm text-gray-600">Avg Cook Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">
                {Math.round(recommendedRecipes.reduce((acc, recipe) => acc + recipe.macros.calories, 0) / recommendedRecipes.length || 0)}
              </p>
              <p className="text-sm text-gray-600">Avg Calories</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Why These Recommendations */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Why These Recipes?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-blue-700">
            <p>• ✅ All recipes match your <strong>vegetarian</strong> dietary preference</p>
            <p>• ✅ No recipes contain <strong>peanuts</strong> (your allergy)</p>
            <p>• ✅ Excludes ingredients you dislike: <strong>broccoli, mushrooms</strong></p>
            <p>• ✅ Prioritizes <strong>Asian</strong> and <strong>Mediterranean</strong> cuisines you love</p>
            <p>• ✅ Focuses on <strong>savory</strong> and <strong>spicy</strong> flavors you enjoy</p>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Recipes */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Perfect Matches For You</h2>
        {recommendedRecipes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations available</h3>
              <p className="text-gray-500">
                We couldn&apos;t find recipes that match all your preferences. Try updating your dietary restrictions or preferences.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onAddToMealPlan={handleAddToMealPlan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
