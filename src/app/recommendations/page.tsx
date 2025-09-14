'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/RecipeCard';
import { mockUser, mockRecipes, getRecommendedRecipes } from '@/lib/mockData';
import { Recipe } from '@/types';
import { Heart, Star, TrendingUp, Clock } from 'lucide-react';

export default function RecommendationsPage() {
  const [user] = useState(mockUser);
  const [recommendedRecipes] = useState<Recipe[]>(getRecommendedRecipes(mockUser, mockRecipes));

  const handleAddToMealPlan = (recipe: Recipe) => {
    console.log('Adding to meal plan:', recipe.name);
    alert(`Added "${recipe.name}" to meal plan!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Heart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recommendations</h1>
          <p className="text-muted-foreground">Personalized recipes just for you, {user.name}</p>
        </div>
      </div>

      {/* User Preferences Summary */}
      <Card className="bg-gradient-to-r from-amaranth-pink/10 to-bright-pink-crayola/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-primary" />
            <span>Your Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Dietary Restrictions</h4>
              <div className="flex flex-wrap gap-1">
                {user.dietary_restrictions.map(restriction => (
                  <Badge key={restriction} variant="secondary">
                    {restriction}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Allergies</h4>
              <div className="flex flex-wrap gap-1">
                {user.allergies.map(allergy => (
                  <Badge key={allergy} variant="destructive">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Liked Cuisines</h4>
              <div className="flex flex-wrap gap-1">
                {user.liked_cuisines.map(cuisine => (
                  <Badge key={cuisine} variant="outline" className="border-accent text-accent">
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Flavor Preferences</h4>
              <div className="flex flex-wrap gap-1">
                {user.liked_flavor_profile.map(flavor => (
                  <Badge key={flavor} variant="outline" className="border-secondary text-secondary">
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
            <TrendingUp className="h-5 w-5 text-accent" />
            <span>Your Daily Macro Targets</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">{user.macro_targets.calories}</p>
              <p className="text-sm text-muted-foreground">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{user.macro_targets.protein_g}g</p>
              <p className="text-sm text-muted-foreground">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{user.macro_targets.carbs_g}g</p>
              <p className="text-sm text-muted-foreground">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">{user.macro_targets.fat_g}g</p>
              <p className="text-sm text-muted-foreground">Fat</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{color: 'var(--amaranth-pink)'}}>{user.macro_targets.fiber_g}g</p>
              <p className="text-sm text-muted-foreground">Fiber</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Heart className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-2xl font-bold">{recommendedRecipes.length}</p>
              <p className="text-sm text-muted-foreground">Recommended Recipes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="h-8 w-8 text-accent mr-3" />
            <div>
              <p className="text-2xl font-bold">
                {Math.round(recommendedRecipes.reduce((acc, recipe) => acc + recipe.time_minutes, 0) / recommendedRecipes.length || 0)}m
              </p>
              <p className="text-sm text-muted-foreground">Avg Cook Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <TrendingUp className="h-8 w-8 text-accent mr-3" />
            <div>
              <p className="text-2xl font-bold">
                {Math.round(recommendedRecipes.reduce((acc, recipe) => acc + recipe.macros.calories, 0) / recommendedRecipes.length || 0)}
              </p>
              <p className="text-sm text-muted-foreground">Avg Calories</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Why These Recommendations */}
      <Card className="bg-accent/10 border-accent/20">
        <CardHeader>
          <CardTitle className="text-accent">Why These Recipes?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-accent">
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
        <h2 className="text-2xl font-semibold text-foreground mb-6">Perfect Matches For You</h2>
        {recommendedRecipes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No recommendations available</h3>
              <p className="text-muted-foreground">
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
