import { Recipe } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Flame, Plus, Heart, BookmarkPlus } from 'lucide-react';
import Image from 'next/image';

interface RecipeCardProps {
  recipe: Recipe;
  onAddToMealPlan?: (recipe: Recipe) => void;
  onToggleFavorite?: (recipe: Recipe) => void;
  onAddToList?: (recipe: Recipe) => void;
  isFavorite?: boolean;
  showAddButton?: boolean;
}

export function RecipeCard({ 
  recipe, 
  onAddToMealPlan, 
  onToggleFavorite,
  onAddToList,
  isFavorite = false,
  showAddButton = true 
}: RecipeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Recipe Image */}
      <div className="relative h-48 bg-gray-200">
        {recipe.thumbnail ? (
          <Image
            src={recipe.thumbnail}
            alt={recipe.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-100 to-red-100">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className="bg-white/90">
            <Clock className="h-3 w-3 mr-1" />
            {recipe.time_minutes}m
          </Badge>
        </div>
        <div className="absolute top-2 left-2 flex gap-1">
          {onToggleFavorite && (
            <Button
              size="sm"
              variant="ghost"
              className={`h-8 w-8 p-0 ${isFavorite ? 'text-red-500 bg-white/90' : 'text-gray-400 bg-white/90'} hover:bg-white`}
              onClick={() => onToggleFavorite(recipe)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          )}
          {onAddToList && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 bg-white/90 hover:bg-white"
              onClick={() => onAddToList(recipe)}
            >
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg leading-tight">{recipe.name}</h3>
          {showAddButton && onAddToMealPlan && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddToMealPlan(recipe)}
              className="ml-2 flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {recipe.tags.meal_type.map((type) => (
            <Badge key={type} variant="secondary" className="text-xs">
              {type}
            </Badge>
          ))}
          {recipe.tags.cuisine_region.map((cuisine) => (
            <Badge key={cuisine} variant="outline" className="text-xs">
              {cuisine}
            </Badge>
          ))}
          {recipe.tags.difficulty_level.map((difficulty) => (
            <Badge 
              key={difficulty} 
              variant={difficulty === 'Easy' ? 'default' : difficulty === 'Medium' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {difficulty}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Macros */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm font-medium">{recipe.macros.calories}</p>
              <p className="text-xs text-gray-500">calories</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">{recipe.num_servings}</p>
              <p className="text-xs text-gray-500">servings</p>
            </div>
          </div>
        </div>

        {/* Detailed Macros */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-sm font-medium text-green-600">{recipe.macros.protein_g}g</p>
            <p className="text-xs text-gray-500">Protein</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-600">{recipe.macros.carbs_g}g</p>
            <p className="text-xs text-gray-500">Carbs</p>
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-600">{recipe.macros.fat_g}g</p>
            <p className="text-xs text-gray-500">Fat</p>
          </div>
          <div>
            <p className="text-sm font-medium text-purple-600">{recipe.macros.fiber_g}g</p>
            <p className="text-xs text-gray-500">Fiber</p>
          </div>
        </div>

        {/* Equipment needed */}
        {recipe.equipment_needed.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">Equipment needed:</p>
            <div className="flex flex-wrap gap-1">
              {recipe.equipment_needed.slice(0, 3).map((equipment) => (
                <Badge key={equipment} variant="outline" className="text-xs">
                  {equipment}
                </Badge>
              ))}
              {recipe.equipment_needed.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{recipe.equipment_needed.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
