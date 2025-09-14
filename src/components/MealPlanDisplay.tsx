'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, Clock, Flame, Users } from "lucide-react";
import { ChefHat } from "lucide-react";
import Image from "next/image";
import { useState } from 'react';

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Macros {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
}

interface Tags {
  meal_type: string[];
  cuisine_region: string[];
  dietary_preferences: string[];
  difficulty_level: string[];
}

interface MealData {
  id: number;
  name: string;
  num_servings: number;
  ingredients: Ingredient[];
  tags: Tags;
  cooking_method: string[];
  equipment_needed: string[];
  flavor_profile: string[];
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  time_minutes: number;
  url: string;
  thumbnail: string;
}

interface DayPlan {
  day: number;
  lunch: MealData;
  dinner: MealData;
}

interface MealPlanDisplayProps {
  mealPlan: DayPlan[];
  onRegenerateRecipes?: () => void;
}

function DayPlanCard({ 
  dayPlan,
  dayNumber
}: { 
  dayPlan: DayPlan;
  dayNumber: number;
}) {
  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Day {dayNumber}</CardTitle>
          <Badge variant="outline" className="text-sm">
            {dayPlan.lunch.calories + dayPlan.dinner.calories} total calories
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Lunch Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-l-4 border-blue-400 bg-blue-50/30 rounded-r-lg">
          <div className="md:col-span-1">
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              {dayPlan.lunch.thumbnail ? (
                <img
                  src={dayPlan.lunch.thumbnail}
                  alt={dayPlan.lunch.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Image failed to load:", dayPlan.lunch.thumbnail);
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="flex flex-col items-center justify-center text-blue-400 h-full"><svg class="h-8 w-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253M9 7h6m-6 4h6m-6 4h6m-6 4h6"></path></svg><span class="text-xs font-medium">Lunch</span></div>';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-blue-400">
                  <ChefHat className="h-8 w-8 mb-1" />
                  <span className="text-xs font-medium">Lunch</span>
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-blue-700">Lunch</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(dayPlan.lunch.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <h5 className="font-medium text-lg">{dayPlan.lunch.name}</h5>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Flame className="h-4 w-4" />
                {dayPlan.lunch.calories} cal
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {dayPlan.lunch.time_minutes} min
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {dayPlan.lunch.num_servings} servings
              </span>
            </div>
          </div>
        </div>

        {/* Dinner Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-l-4 border-orange-400 bg-orange-50/30 rounded-r-lg">
          <div className="md:col-span-1">
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
              {dayPlan.dinner.thumbnail ? (
                <img
                  src={dayPlan.dinner.thumbnail}
                  alt={dayPlan.dinner.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Image failed to load:", dayPlan.dinner.thumbnail);
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="flex flex-col items-center justify-center text-orange-400 h-full"><svg class="h-8 w-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253M9 7h6m-6 4h6m-6 4h6m-6 4h6"></path></svg><span class="text-xs font-medium">Dinner</span></div>';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-orange-400">
                  <ChefHat className="h-8 w-8 mb-1" />
                  <span className="text-xs font-medium">Dinner</span>
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-orange-700">Dinner</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(dayPlan.dinner.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <h5 className="font-medium text-lg">{dayPlan.dinner.name}</h5>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Flame className="h-4 w-4" />
                {dayPlan.dinner.calories} cal
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {dayPlan.dinner.time_minutes} min
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {dayPlan.dinner.num_servings} servings
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export function MealPlanDisplay({ mealPlan, onRegenerateRecipes }: MealPlanDisplayProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Weekly Meal Plan</h2>
        <p className="text-muted-foreground">Your personalized 7-day meal plan with lunch and dinner options</p>
        
        {onRegenerateRecipes && (
          <Button 
            onClick={onRegenerateRecipes}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate Recipes
          </Button>
        )}
      </div>
      
      {/* Meal Plan Cards */}
      <div className="space-y-6">
        {mealPlan.map((dayPlan) => (
          <DayPlanCard 
            key={dayPlan.day}
            dayPlan={dayPlan}
            dayNumber={dayPlan.day}
          />
        ))}
      </div>
    </div>
  );
}
