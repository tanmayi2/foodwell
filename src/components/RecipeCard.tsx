import { Recipe } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Flame, Plus, Heart, BookmarkPlus } from 'lucide-react';
import { AddToListDialog } from './AddToListDialog';
import Image from 'next/image';
import { useState } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  onAddToMealPlan?: (recipe: Recipe) => void;
  onToggleFavorite?: (recipe: Recipe) => void;
  isFavorite?: boolean;
  showAddButton?: boolean;
}

export function RecipeCard({ 
  recipe, 
  onToggleFavorite,
  isFavorite = false
}: RecipeCardProps) {
  const [showAddToListDialog, setShowAddToListDialog] = useState(false);
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Recipe Image */}
      <div className="relative h-48 bg-muted">
        {recipe.thumbnail ? (
          <Image
            src={recipe.thumbnail}
            alt={recipe.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-amaranth-pink/20 to-bright-pink-crayola/20">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            <Clock className="h-3 w-3 mr-1" />
            {recipe.time_minutes}m
          </Badge>
        </div>
        <div className="absolute top-2 left-2 flex gap-1">
          {onToggleFavorite && (
            <Button
              size="sm"
              variant="ghost"
              className={`h-8 w-8 p-0 ${isFavorite ? 'text-rusty-red bg-card/90' : 'text-muted-foreground bg-card/90'} hover:bg-card`}
              onClick={() => onToggleFavorite(recipe)}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-gray-400 bg-white/90 hover:bg-white"
            onClick={() => setShowAddToListDialog(true)}
          >
            <BookmarkPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg leading-tight">{recipe.name}</h3>
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
              variant={difficulty === 'easy' ? 'default' : difficulty === 'intermediate' ? 'secondary' : 'destructive'}
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
            <Flame className="h-4 w-4 text-rusty-red" />
            <div>
              <p className="text-sm font-medium">{recipe.macros.calories}</p>
              <p className="text-xs text-muted-foreground">calories</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-accent" />
            <div>
              <p className="text-sm font-medium">{recipe.num_servings}</p>
              <p className="text-xs text-muted-foreground">servings</p>
            </div>
          </div>
        </div>

        {/* Detailed Macros */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-sm font-medium text-primary">{recipe.macros.protein_g}g</p>
            <p className="text-xs text-muted-foreground">Protein</p>
          </div>
          <div>
            <p className="text-sm font-medium text-accent">{recipe.macros.carbs_g}g</p>
            <p className="text-xs text-muted-foreground">Carbs</p>
          </div>
          <div>
            <p className="text-sm font-medium text-secondary">{recipe.macros.fat_g}g</p>
            <p className="text-xs text-muted-foreground">Fat</p>
          </div>
          <div>
            <p className="text-sm font-medium" style={{color: 'var(--amaranth-pink)'}}>{recipe.macros.fiber_g}g</p>
            <p className="text-xs text-muted-foreground">Fiber</p>
          </div>
        </div>

        {/* Equipment needed */}
        {recipe.equipment_needed.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-1">Equipment needed:</p>
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
      
      <AddToListDialog
        recipe={recipe}
        open={showAddToListDialog}
        onOpenChange={setShowAddToListDialog}
      />
    </Card>
  );
}
