'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RecipeCard } from '@/components/RecipeCard';
import { useRecipes } from '@/contexts/RecipeContext';
import { mockRecipes } from '@/lib/mockData';
import { Recipe } from '@/types';
import { getCuisines, getMealTypes, getDifficultyLevels, getDisplayName } from '@/lib/enums';
import { Search, Filter, ChefHat } from 'lucide-react';

export default function RecipesPage() {
  const [recipes] = useState<Recipe[]>(mockRecipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [maxTime, setMaxTime] = useState<string>('all');

  const { toggleFavorite, isFavorite, userRecipeData, addToList } = useRecipes();

  // Get enum values for filters
  const cuisines = getCuisines();
  const mealTypes = getMealTypes();
  const difficulties = getDifficultyLevels();

  // Filter recipes based on search and filters
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCuisine = selectedCuisine === 'all' || 
                          recipe.tags.cuisine_region.includes(selectedCuisine as any);
    
    const matchesMealType = selectedMealType === 'all' || 
                           recipe.tags.meal_type.includes(selectedMealType as any);
    
    const matchesDifficulty = selectedDifficulty === 'all' || 
                             recipe.tags.difficulty_level.includes(selectedDifficulty as any);
    
    const matchesTime = maxTime === 'all' || 
                       (maxTime === '15' && recipe.time_minutes <= 15) ||
                       (maxTime === '30' && recipe.time_minutes <= 30) ||
                       (maxTime === '60' && recipe.time_minutes <= 60);

    return matchesSearch && matchesCuisine && matchesMealType && matchesDifficulty && matchesTime;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCuisine('all');
    setSelectedMealType('all');
    setSelectedDifficulty('all');
    setMaxTime('all');
  };

  const handleAddToMealPlan = (recipe: Recipe) => {
    console.log('Adding to meal plan:', recipe.name);
    alert(`Added "${recipe.name}" to meal plan!`);
  };

  const handleAddToList = (recipe: Recipe) => {
    if (userRecipeData.custom_lists.length > 0) {
      addToList(userRecipeData.custom_lists[0].id, recipe.id);
      alert(`Added "${recipe.name}" to "${userRecipeData.custom_lists[0].name}"!`);
    } else {
      alert('Create a list first in the Meal Plan section!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <ChefHat className="h-8 w-8 text-orange-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recipe Library</h1>
          <p className="text-gray-600">Discover and explore delicious recipes</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search recipes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger>
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                {cuisines.map(cuisine => (
                  <SelectItem key={cuisine} value={cuisine} className="capitalize">
                    {getDisplayName(cuisine)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMealType} onValueChange={setSelectedMealType}>
              <SelectTrigger>
                <SelectValue placeholder="Meal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Meals</SelectItem>
                {mealTypes.map(mealType => (
                  <SelectItem key={mealType} value={mealType} className="capitalize">
                    {getDisplayName(mealType)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty} className="capitalize">
                    {getDisplayName(difficulty)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={maxTime} onValueChange={setMaxTime}>
              <SelectTrigger>
                <SelectValue placeholder="Max Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Time</SelectItem>
                <SelectItem value="15">Under 15 min</SelectItem>
                <SelectItem value="30">Under 30 min</SelectItem>
                <SelectItem value="60">Under 1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters and Clear */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary">
                  Search: {searchTerm}
                </Badge>
              )}
              {selectedCuisine !== 'all' && (
                <Badge variant="secondary">
                  Cuisine: {selectedCuisine}
                </Badge>
              )}
              {selectedMealType !== 'all' && (
                <Badge variant="secondary">
                  Meal: {selectedMealType}
                </Badge>
              )}
              {selectedDifficulty !== 'all' && (
                <Badge variant="secondary">
                  Difficulty: {selectedDifficulty}
                </Badge>
              )}
              {maxTime !== 'all' && (
                <Badge variant="secondary">
                  Time: Under {maxTime} min
                </Badge>
              )}
            </div>
            {(searchTerm || selectedCuisine !== 'all' || selectedMealType !== 'all' || 
              selectedDifficulty !== 'all' || maxTime !== 'all') && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredRecipes.length} of {recipes.length} recipes
        </p>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={(recipe) => toggleFavorite(recipe.id)}
              onAddToMealPlan={handleAddToMealPlan}
            />
          ))}
        </div>
      )}
    </div>
  );
}
