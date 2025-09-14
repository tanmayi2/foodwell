"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MealPlanDisplay } from "@/components/MealPlanDisplay";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<any[] | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<{ [key: string]: any }>(
    {}
  );
  const [formData, setFormData] = useState({
    name: "Test User",
    dietary_restrictions: "keto",
    allergies: "",
    calories: 2000,
    protein_g: 80,
    carbs_g: 200,
    fat_g: 65,
    fiber_g: 25,
    liked_cuisines: "japanese",
    liked_ingredients: "salmon, rice, tomatoes",
    disliked_cuisines: "italian",
    disliked_ingredients: "peanuts",
    liked_flavor_profile: "umami",
    budget_priority: "high",
    health_priority: "high",
    convenience_priority: "medium",
    address: "123 Test St",
    city: "Boston",
    state: "MA",
    zip: "02101",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMealPlan(null);

    console.log("Starting meal plan generation...");
    const startTime = Date.now();

    try {
      const userProfile = {
        id: 1,
        name: formData.name,
        dietary_restrictions: formData.dietary_restrictions
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        allergies: formData.allergies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        macro_targets: {
          calories: formData.calories,
          protein_g: formData.protein_g,
          carbs_g: formData.carbs_g,
          fat_g: formData.fat_g,
          fiber_g: formData.fiber_g,
        },
        liked_cuisines: formData.liked_cuisines
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        liked_ingredients: formData.liked_ingredients
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        disliked_cuisines: formData.disliked_cuisines
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        disliked_ingredients: formData.disliked_ingredients
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        liked_flavor_profile: formData.liked_flavor_profile
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        priorities: {
          budget: formData.budget_priority,
          health: formData.health_priority,
          convenience: formData.convenience_priority,
        },
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout for agent processing

      console.log("Sending request to API...");
      const response = await fetch("/api/toolhouse/recipe-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message:
            "Generate exactly 7 day meal plans (lunch + dinner only). Return as JSON array format: [{day: 1, lunch: {id, name, calories, time_minutes, ingredients, url}, dinner: {same format}}]. Keep responses concise.",
          userProfile,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log(`API response received in ${Date.now() - startTime}ms`);

      if (!response.ok) {
        throw new Error(
          `Failed to generate meal plan: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log(
        "Response parsed, total time:",
        Date.now() - startTime + "ms"
      );

      if (result.success && result.data) {
        try {
          let parsedContent;
          const content = result.data.content;

          // Log the raw content for debugging
          console.log("Raw agent response:", content);
          console.log("Raw content length:", content.length);

          // Try to extract JSON from the response
          if (typeof content === "string") {
            // Look for JSON array or object in the response
            const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
            if (jsonMatch) {
              parsedContent = JSON.parse(jsonMatch[0]);
            } else {
              // If no JSON found, try parsing the entire content
              parsedContent = JSON.parse(content);
            }
          } else {
            // Content is already parsed
            parsedContent = content;
          }

          // Ensure we have an array format for the meal plan
          if (Array.isArray(parsedContent)) {
            console.log("Parsed meal plan array:", JSON.stringify(parsedContent, null, 2));
            setMealPlan(parsedContent);
          } else if (parsedContent && typeof parsedContent === "object") {
            // If it's an object, try to extract the meal plan array
            const mealPlanArray = parsedContent.mealPlan ||
              parsedContent.days ||
              parsedContent.meals || [parsedContent];
            console.log("Extracted meal plan array:", JSON.stringify(mealPlanArray, null, 2));
            setMealPlan(
              Array.isArray(mealPlanArray) ? mealPlanArray : [mealPlanArray]
            );
          } else {
            throw new Error("Unexpected response format");
          }
        } catch (parseError) {
          console.error("Failed to parse meal plan JSON:", parseError);
          console.error("Raw content:", result.data.content);
          setMealPlan(null);
          throw new Error(
            "Invalid meal plan format received. Please try again."
          );
        }
      } else {
        throw new Error(result.error || "Failed to generate meal plan");
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
      setMealPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMealSelect = (
    day: number,
    mealType: "lunch" | "dinner",
    meal: any
  ) => {
    const key = `${day}-${mealType}`;
    setSelectedMeals((prev) => ({
      ...prev,
      [key]: meal,
    }));
  };

  const handleRegenerateRecipes = () => {
    setMealPlan(null);
    setSelectedMeals({});
    // Trigger form submission to regenerate
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 mt-2">
              AI agent is generating your meal plan... This may take 2-3
              minutes.
            </span>
            <div className="text-sm text-muted-foreground mt-2">
              The agent is analyzing your preferences and creating personalized
              recipes.
            </div>
          </div>
        )}
        <div className="flex items-center justify-center space-x-2">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            FoodWell Meal Planner
          </h1>
        </div>
        <p className="text-muted-foreground">
          Enter your preferences to generate a personalized weekly meal plan
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="dietary_restrictions">
                  Dietary Restrictions
                </Label>
                <Input
                  id="dietary_restrictions"
                  value={formData.dietary_restrictions}
                  onChange={(e) =>
                    handleInputChange("dietary_restrictions", e.target.value)
                  }
                  placeholder="e.g., keto, vegetarian, vegan"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                placeholder="e.g., nuts, shellfish, dairy"
              />
            </div>

            {/* Macro Targets */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Macro Targets</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) =>
                      handleInputChange(
                        "calories",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="protein_g">Protein (g)</Label>
                  <Input
                    id="protein_g"
                    type="number"
                    value={formData.protein_g}
                    onChange={(e) =>
                      handleInputChange(
                        "protein_g",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="carbs_g">Carbs (g)</Label>
                  <Input
                    id="carbs_g"
                    type="number"
                    value={formData.carbs_g}
                    onChange={(e) =>
                      handleInputChange(
                        "carbs_g",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="fat_g">Fat (g)</Label>
                  <Input
                    id="fat_g"
                    type="number"
                    value={formData.fat_g}
                    onChange={(e) =>
                      handleInputChange("fat_g", parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="fiber_g">Fiber (g)</Label>
                  <Input
                    id="fiber_g"
                    type="number"
                    value={formData.fiber_g}
                    onChange={(e) =>
                      handleInputChange(
                        "fiber_g",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Food Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="liked_cuisines">Liked Cuisines</Label>
                <Input
                  id="liked_cuisines"
                  value={formData.liked_cuisines}
                  onChange={(e) =>
                    handleInputChange("liked_cuisines", e.target.value)
                  }
                  placeholder="e.g., japanese, italian, mexican"
                />
              </div>
              <div>
                <Label htmlFor="disliked_cuisines">Disliked Cuisines</Label>
                <Input
                  id="disliked_cuisines"
                  value={formData.disliked_cuisines}
                  onChange={(e) =>
                    handleInputChange("disliked_cuisines", e.target.value)
                  }
                  placeholder="e.g., indian, thai"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="liked_ingredients">Liked Ingredients</Label>
                <Input
                  id="liked_ingredients"
                  value={formData.liked_ingredients}
                  onChange={(e) =>
                    handleInputChange("liked_ingredients", e.target.value)
                  }
                  placeholder="e.g., salmon, rice, tomatoes"
                />
              </div>
              <div>
                <Label htmlFor="disliked_ingredients">
                  Disliked Ingredients
                </Label>
                <Input
                  id="disliked_ingredients"
                  value={formData.disliked_ingredients}
                  onChange={(e) =>
                    handleInputChange("disliked_ingredients", e.target.value)
                  }
                  placeholder="e.g., peanuts, mushrooms"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="liked_flavor_profile">Flavor Profile</Label>
              <Input
                id="liked_flavor_profile"
                value={formData.liked_flavor_profile}
                onChange={(e) =>
                  handleInputChange("liked_flavor_profile", e.target.value)
                }
                placeholder="e.g., umami, spicy, sweet"
              />
            </div>

            {/* Priorities */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Priorities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="budget_priority">Budget Priority</Label>
                  <select
                    id="budget_priority"
                    value={formData.budget_priority}
                    onChange={(e) =>
                      handleInputChange("budget_priority", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="health_priority">Health Priority</Label>
                  <select
                    id="health_priority"
                    value={formData.health_priority}
                    onChange={(e) =>
                      handleInputChange("health_priority", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="convenience_priority">
                    Convenience Priority
                  </Label>
                  <select
                    id="convenience_priority"
                    value={formData.convenience_priority}
                    onChange={(e) =>
                      handleInputChange("convenience_priority", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Boston"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="MA"
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={(e) => handleInputChange("zip", e.target.value)}
                    placeholder="02101"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Meal Plan...
                </>
              ) : (
                "Generate Weekly Meal Plan"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {mealPlan && (
        <MealPlanDisplay
          mealPlan={mealPlan}
          onRegenerateRecipes={handleRegenerateRecipes}
        />
      )}
    </div>
  );
}
