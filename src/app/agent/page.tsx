'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/RecipeCard';
import { Recipe } from '@/types';
import { 
  Bot, 
  Sparkles, 
  Loader2,
  Calendar
} from 'lucide-react';

export default function AgentPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [weeklyMealPlan, setWeeklyMealPlan] = useState<{ [day: string]: { [mealType: string]: Recipe } }>({});

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  const parseRecipes = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        const mealPlanByDay: { [day: string]: { [mealType: string]: Recipe } } = {};
        
        // For each day in the parsed data
        parsed.forEach((dayPlan, dayIndex) => {
          const dayName = daysOfWeek[dayIndex] || `Day ${dayIndex + 1}`;
          mealPlanByDay[dayName] = {};
          
          Object.entries(dayPlan).forEach(([mealType, recipeData]: [string, any]) => {
            if (recipeData && typeof recipeData === 'object' && recipeData.name) {
              // Convert to proper Recipe format
              const recipe: Recipe = {
                id: recipeData.id,
                name: recipeData.name,
                num_servings: recipeData.num_servings,
                ingredients: recipeData.ingredients,
                tags: recipeData.tags,
                cooking_method: recipeData.cooking_method,
                equipment_needed: recipeData.equipment_needed,
                flavor_profile: recipeData.flavor_profile,
                calories: recipeData.calories,
                protein_g: recipeData.protein_g,
                carbs_g: recipeData.carbs_g,
                fat_g: recipeData.fat_g,
                fiber_g: recipeData.fiber_g,
                time_minutes: recipeData.time_minutes,
                url: recipeData.url,
                thumbnail: recipeData.thumbnail
              };
              mealPlanByDay[dayName][mealType] = recipe;
            }
          });
        });
        
        return mealPlanByDay;
      }
    } catch (error) {
      console.log('Not JSON recipe data');
    }
    return {};
  };

  const generateMealPlan = async () => {
    setIsLoading(true);
    setStreamingResponse('');
    setWeeklyMealPlan({});

    try {
      const response = await fetch('/api/toolhouse/recipe-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Generate a full 7-day meal plan with 2 meals for a vegetarian.",
          userProfile: {
            id: 1,
            name: "Test User",
            dietary_restrictions: ["vegetarian"],
            allergies: [],
            macro_targets: {
              calories: 2000,
              protein_g: 80,
              carbs_g: 200,
              fat_g: 65,
              fiber_g: 25
            },
            liked_cuisines: ["italian"],
            liked_ingredients: ["pasta", "cheese"],
            disliked_cuisines: [],
            disliked_ingredients: [],
            liked_flavor_profile: ["savory"],
            priorities: {
              budget: "medium",
              health: "high",
              convenience: "medium"
            },
            address: "123 Test St",
            city: "Boston",
            state: "MA",
            zip: "02101"
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const result = await response.json();
      
      if (result.success && result.data?.content) {
        const content = result.data.content;
        setStreamingResponse(content);
        console.log(content);
        
        // Try to parse and extract recipes
        const mealPlan = parseRecipes(content);
        if (Object.keys(mealPlan).length > 0) {
          setWeeklyMealPlan(mealPlan);
        }
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setStreamingResponse('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate meal plan on page load
  useEffect(() => {
    generateMealPlan();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="rainbow-pulse p-3 rounded-full">
            <Bot className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Super Agentic Mode
          </h1>
          <Sparkles className="h-8 w-8 text-yellow-500" />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-8 w-8 animate-spin rainbow-pulse" />
              <span className="text-lg">Generating your personalized meal plan...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Response
      {streamingResponse && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>AI Response</span>
              <Badge variant="secondary" className="rainbow-pulse text-white">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm whitespace-pre-wrap p-4 bg-muted rounded-lg">
              {streamingResponse}
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Weekly Meal Plan */}
      {Object.keys(weeklyMealPlan).length > 0 && !isLoading && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Calendar className="h-6 w-6" />
              Your 7-Day Meal Plan
            </h2>
            <p className="text-muted-foreground mt-2">AI-generated personalized recipes for the week</p>
          </div>
          
          {/* Weekly Calendar */}
          <div className="space-y-4">
            {daysOfWeek.map(day => {
              const dayMeals = weeklyMealPlan[day];
              if (!dayMeals || Object.keys(dayMeals).length === 0) return null;
              
              return (
                <Card key={day} className="border-2 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Badge className="rainbow-pulse text-white border-0">{day}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mealTypes.map(mealType => {
                        const recipe = dayMeals[mealType];
                        if (!recipe) return null;
                        
                        return (
                          <div key={mealType} className="space-y-3">
                            <h4 className="font-medium text-sm capitalize text-gray-700 flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {mealType}
                              </Badge>
                            </h4>
                            <RecipeCard
                              recipe={recipe}
                              showAddButton={false}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
