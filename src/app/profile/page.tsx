"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, LogIn, Edit2, Save, X } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { 
  getDietaryRestrictions, 
  getCuisines, 
  getIngredients, 
  getFlavorProfiles, 
  getAllergens, 
  getPriorities,
  getDisplayName 
} from "@/lib/enums";

interface Profile {
  id: string;
  email: string;
  name: string;
  dietary_restrictions: string[];
  allergies: string[];
  target_calories: number;
  target_protein_g: number;
  target_carbs_g: number;
  target_fat_g: number;
  target_fiber_g: number;
  role: 'shopper' | 'deliverer';
  liked_cuisines: string[];
  liked_ingredients: string[];
  disliked_cuisines: string[];
  disliked_ingredients: string[];
  liked_flavor_profile: string[];
  priorities: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
  created_at: string;
  updated_at: string;
}

interface UserData {
  user: {
    id: string;
    email: string;
    created_at: string;
    user_metadata?: {
      name?: string;
    };
  };
  profile: Profile;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    dietary_restrictions: [] as string[],
    allergies: [] as string[],
    target_calories: 2000,
    target_protein_g: 100,
    target_carbs_g: 250,
    target_fat_g: 70,
    target_fiber_g: 30,
    role: 'shopper' as 'shopper' | 'deliverer',
    liked_cuisines: [] as string[],
    liked_ingredients: [] as string[],
    disliked_cuisines: [] as string[],
    disliked_ingredients: [] as string[],
    liked_flavor_profile: [] as string[],
    priorities: [] as string[],
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [newRestriction, setNewRestriction] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newLikedCuisine, setNewLikedCuisine] = useState("");
  const [newLikedIngredient, setNewLikedIngredient] = useState("");
  const [newDislikedCuisine, setNewDislikedCuisine] = useState("");
  const [newDislikedIngredient, setNewDislikedIngredient] = useState("");
  const [newFlavorProfile, setNewFlavorProfile] = useState("");
  const [newPriority, setNewPriority] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data: UserData = await response.json();
      setUserData(data);
      
      // Initialize form data
      setFormData({
        name: data.profile?.name || data.user.user_metadata?.name || "",
        dietary_restrictions: data.profile?.dietary_restrictions || [],
        allergies: data.profile?.allergies || [],
        target_calories: data.profile?.target_calories || 2000,
        target_protein_g: data.profile?.target_protein_g || 100,
        target_carbs_g: data.profile?.target_carbs_g || 250,
        target_fat_g: data.profile?.target_fat_g || 70,
        target_fiber_g: data.profile?.target_fiber_g || 30,
        role: data.profile?.role || 'shopper',
        liked_cuisines: data.profile?.liked_cuisines || [],
        liked_ingredients: data.profile?.liked_ingredients || [],
        disliked_cuisines: data.profile?.disliked_cuisines || [],
        disliked_ingredients: data.profile?.disliked_ingredients || [],
        liked_flavor_profile: data.profile?.liked_flavor_profile || [],
        priorities: data.profile?.priorities || [],
        address: data.profile?.address || "",
        city: data.profile?.city || "",
        state: data.profile?.state || "",
        zip: data.profile?.zip || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      await fetchProfile(); // Refresh data
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFormData({
        name: userData.profile?.name || userData.user.user_metadata?.name || "",
        dietary_restrictions: userData.profile?.dietary_restrictions || [],
        allergies: userData.profile?.allergies || [],
        target_calories: userData.profile?.target_calories || 2000,
        target_protein_g: userData.profile?.target_protein_g || 100,
        target_carbs_g: userData.profile?.target_carbs_g || 250,
        target_fat_g: userData.profile?.target_fat_g || 70,
        target_fiber_g: userData.profile?.target_fiber_g || 30,
        role: userData.profile?.role || 'shopper',
        liked_cuisines: userData.profile?.liked_cuisines || [],
        liked_ingredients: userData.profile?.liked_ingredients || [],
        disliked_cuisines: userData.profile?.disliked_cuisines || [],
        disliked_ingredients: userData.profile?.disliked_ingredients || [],
        liked_flavor_profile: userData.profile?.liked_flavor_profile || [],
        priorities: userData.profile?.priorities || [],
        address: userData.profile?.address || "",
        city: userData.profile?.city || "",
        state: userData.profile?.state || "",
        zip: userData.profile?.zip || "",
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const addRestriction = () => {
    if (newRestriction.trim() && !formData.dietary_restrictions.includes(newRestriction.trim())) {
      setFormData(prev => ({
        ...prev,
        dietary_restrictions: [...prev.dietary_restrictions, newRestriction.trim()]
      }));
      setNewRestriction("");
    }
  };

  const removeRestriction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.filter((_, i) => i !== index)
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  };

  // Helper functions for managing food preferences
  const addLikedCuisine = () => {
    if (newLikedCuisine.trim() && !formData.liked_cuisines.includes(newLikedCuisine.trim())) {
      setFormData(prev => ({
        ...prev,
        liked_cuisines: [...prev.liked_cuisines, newLikedCuisine.trim()]
      }));
      setNewLikedCuisine("");
    }
  };

  const removeLikedCuisine = (index: number) => {
    setFormData(prev => ({
      ...prev,
      liked_cuisines: prev.liked_cuisines.filter((_, i) => i !== index)
    }));
  };

  const addLikedIngredient = () => {
    if (newLikedIngredient.trim() && !formData.liked_ingredients.includes(newLikedIngredient.trim())) {
      setFormData(prev => ({
        ...prev,
        liked_ingredients: [...prev.liked_ingredients, newLikedIngredient.trim()]
      }));
      setNewLikedIngredient("");
    }
  };

  const removeLikedIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      liked_ingredients: prev.liked_ingredients.filter((_, i) => i !== index)
    }));
  };

  const addDislikedCuisine = () => {
    if (newDislikedCuisine.trim() && !formData.disliked_cuisines.includes(newDislikedCuisine.trim())) {
      setFormData(prev => ({
        ...prev,
        disliked_cuisines: [...prev.disliked_cuisines, newDislikedCuisine.trim()]
      }));
      setNewDislikedCuisine("");
    }
  };

  const removeDislikedCuisine = (index: number) => {
    setFormData(prev => ({
      ...prev,
      disliked_cuisines: prev.disliked_cuisines.filter((_, i) => i !== index)
    }));
  };

  const addDislikedIngredient = () => {
    if (newDislikedIngredient.trim() && !formData.disliked_ingredients.includes(newDislikedIngredient.trim())) {
      setFormData(prev => ({
        ...prev,
        disliked_ingredients: [...prev.disliked_ingredients, newDislikedIngredient.trim()]
      }));
      setNewDislikedIngredient("");
    }
  };

  const removeDislikedIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      disliked_ingredients: prev.disliked_ingredients.filter((_, i) => i !== index)
    }));
  };

  const addFlavorProfile = () => {
    if (newFlavorProfile.trim() && !formData.liked_flavor_profile.includes(newFlavorProfile.trim())) {
      setFormData(prev => ({
        ...prev,
        liked_flavor_profile: [...prev.liked_flavor_profile, newFlavorProfile.trim()]
      }));
      setNewFlavorProfile("");
    }
  };

  const removeFlavorProfile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      liked_flavor_profile: prev.liked_flavor_profile.filter((_, i) => i !== index)
    }));
  };

  const addPriority = () => {
    if (newPriority.trim() && !formData.priorities.includes(newPriority.trim())) {
      setFormData(prev => ({
        ...prev,
        priorities: [...prev.priorities, newPriority.trim()]
      }));
      setNewPriority("");
    }
  };

  const removePriority = (index: number) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities.filter((_, i) => i !== index)
    }));
  };

  if (loading || fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
              <UserIcon className="h-8 w-8" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please sign in to view your profile
            </p>
            <Link href="/login">
              <Button className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="text-center space-y-4 pt-6">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchProfile}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleCancel} variant="outline" disabled={saving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <p className="text-lg">{userData?.user.email}</p>
            </div>
            <div>
              <Label>User ID</Label>
              <p className="text-lg font-mono text-gray-600">{userData?.user.id}</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="name">Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
              />
            ) : (
              <p className="text-lg">{formData.name || 'Not provided'}</p>
            )}
          </div>
          
          <div>
            <Label>Account Created</Label>
            <p className="text-lg">{new Date(userData?.user.created_at || '').toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Dietary Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle>Dietary Restrictions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.dietary_restrictions.map((restriction, index) => (
              <div key={restriction} className="flex items-center gap-1">
                <Badge variant="default">{restriction}</Badge>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeRestriction(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            {formData.dietary_restrictions.length === 0 && (
              <p className="text-gray-500 text-sm">No dietary restrictions</p>
            )}
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <Combobox
                options={getDietaryRestrictions()
                  .filter(restriction => !formData.dietary_restrictions.includes(restriction))
                  .map(restriction => ({
                    value: restriction,
                    label: getDisplayName(restriction)
                  }))}
                value={newRestriction}
                onValueChange={setNewRestriction}
                placeholder="Select dietary restriction"
                searchPlaceholder="Search restrictions..."
                emptyMessage="No restrictions found."
                className="flex-1"
              />
              <Button onClick={addRestriction} disabled={!newRestriction.trim()}>
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle>Allergies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.allergies.map((allergy, index) => (
              <div key={allergy} className="flex items-center gap-1">
                <Badge variant="destructive">{allergy}</Badge>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeAllergy(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            {formData.allergies.length === 0 && (
              <p className="text-gray-500 text-sm">No allergies</p>
            )}
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <Combobox
                options={getAllergens()
                  .filter(allergen => !formData.allergies.includes(allergen))
                  .map(allergen => ({
                    value: allergen,
                    label: getDisplayName(allergen)
                  }))}
                value={newAllergy}
                onValueChange={setNewAllergy}
                placeholder="Select allergy"
                searchPlaceholder="Search allergies..."
                emptyMessage="No allergies found."
                className="flex-1"
              />
              <Button onClick={addAllergy} disabled={!newAllergy.trim()}>
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Macro Targets */}
      <Card>
        <CardHeader>
          <CardTitle>Macro Targets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="calories">Calories</Label>
              {isEditing ? (
                <Input
                  id="calories"
                  type="number"
                  value={formData.target_calories}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_calories: parseInt(e.target.value) || 0 }))}
                />
              ) : (
                <p className="text-lg font-semibold">{formData.target_calories}</p>
              )}
            </div>
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              {isEditing ? (
                <Input
                  id="protein"
                  type="number"
                  value={formData.target_protein_g}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_protein_g: parseInt(e.target.value) || 0 }))}
                />
              ) : (
                <p className="text-lg font-semibold">{formData.target_protein_g}g</p>
              )}
            </div>
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              {isEditing ? (
                <Input
                  id="carbs"
                  type="number"
                  value={formData.target_carbs_g}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_carbs_g: parseInt(e.target.value) || 0 }))}
                />
              ) : (
                <p className="text-lg font-semibold">{formData.target_carbs_g}g</p>
              )}
            </div>
            <div>
              <Label htmlFor="fat">Fat (g)</Label>
              {isEditing ? (
                <Input
                  id="fat"
                  type="number"
                  value={formData.target_fat_g}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_fat_g: parseInt(e.target.value) || 0 }))}
                />
              ) : (
                <p className="text-lg font-semibold">{formData.target_fat_g}g</p>
              )}
            </div>
            <div>
              <Label htmlFor="fiber">Fiber (g)</Label>
              {isEditing ? (
                <Input
                  id="fiber"
                  type="number"
                  value={formData.target_fiber_g}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_fiber_g: parseInt(e.target.value) || 0 }))}
                />
              ) : (
                <p className="text-lg font-semibold">{formData.target_fiber_g}g</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liked Cuisines */}
      <Card>
        <CardHeader>
          <CardTitle>Liked Cuisines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.liked_cuisines.map((cuisine, index) => (
              <div key={cuisine} className="flex items-center gap-1">
                <Badge variant="secondary">{cuisine}</Badge>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeLikedCuisine(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            {formData.liked_cuisines.length === 0 && (
              <p className="text-gray-500 text-sm">No cuisine preferences</p>
            )}
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <Combobox
                options={getCuisines()
                  .filter(cuisine => !formData.liked_cuisines.includes(cuisine))
                  .map(cuisine => ({
                    value: cuisine,
                    label: getDisplayName(cuisine)
                  }))}
                value={newLikedCuisine}
                onValueChange={setNewLikedCuisine}
                placeholder="Select liked cuisine"
                searchPlaceholder="Search cuisines..."
                emptyMessage="No cuisines found."
                className="flex-1"
              />
              <Button onClick={addLikedCuisine} disabled={!newLikedCuisine.trim()}>
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disliked Cuisines */}
      <Card>
        <CardHeader>
          <CardTitle>Disliked Cuisines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.disliked_cuisines.map((cuisine, index) => (
              <div key={cuisine} className="flex items-center gap-1">
                <Badge variant="outline">{cuisine}</Badge>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeDislikedCuisine(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            {formData.disliked_cuisines.length === 0 && (
              <p className="text-gray-500 text-sm">No disliked cuisines</p>
            )}
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <Combobox
                options={getCuisines()
                  .filter(cuisine => !formData.disliked_cuisines.includes(cuisine))
                  .map(cuisine => ({
                    value: cuisine,
                    label: getDisplayName(cuisine)
                  }))}
                value={newDislikedCuisine}
                onValueChange={setNewDislikedCuisine}
                placeholder="Select disliked cuisine"
                searchPlaceholder="Search cuisines..."
                emptyMessage="No cuisines found."
                className="flex-1"
              />
              <Button onClick={addDislikedCuisine} disabled={!newDislikedCuisine.trim()}>
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liked Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>Liked Ingredients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.liked_ingredients.map((ingredient, index) => (
              <div key={ingredient} className="flex items-center gap-1">
                <Badge variant="secondary">{ingredient}</Badge>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeLikedIngredient(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            {formData.liked_ingredients.length === 0 && (
              <p className="text-gray-500 text-sm">No ingredient preferences</p>
            )}
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <Combobox
                options={getIngredients()
                  .filter(ingredient => !formData.liked_ingredients.includes(ingredient))
                  .map(ingredient => ({
                    value: ingredient,
                    label: getDisplayName(ingredient)
                  }))}
                value={newLikedIngredient}
                onValueChange={setNewLikedIngredient}
                placeholder="Select liked ingredient"
                searchPlaceholder="Search ingredients..."
                emptyMessage="No ingredients found."
                className="flex-1"
              />
              <Button onClick={addLikedIngredient} disabled={!newLikedIngredient.trim()}>
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disliked Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>Disliked Ingredients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.disliked_ingredients.map((ingredient, index) => (
              <div key={ingredient} className="flex items-center gap-1">
                <Badge variant="outline">{ingredient}</Badge>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeDislikedIngredient(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            {formData.disliked_ingredients.length === 0 && (
              <p className="text-gray-500 text-sm">No disliked ingredients</p>
            )}
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <Combobox
                options={getIngredients()
                  .filter(ingredient => !formData.disliked_ingredients.includes(ingredient))
                  .map(ingredient => ({
                    value: ingredient,
                    label: getDisplayName(ingredient)
                  }))}
                value={newDislikedIngredient}
                onValueChange={setNewDislikedIngredient}
                placeholder="Select disliked ingredient"
                searchPlaceholder="Search ingredients..."
                emptyMessage="No ingredients found."
                className="flex-1"
              />
              <Button onClick={addDislikedIngredient} disabled={!newDislikedIngredient.trim()}>
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flavor Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Flavor Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.liked_flavor_profile.map((flavor, index) => (
              <div key={flavor} className="flex items-center gap-1">
                <Badge variant="secondary">{flavor}</Badge>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeFlavorProfile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            {formData.liked_flavor_profile.length === 0 && (
              <p className="text-gray-500 text-sm">No flavor preferences</p>
            )}
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <Combobox
                options={getFlavorProfiles()
                  .filter(flavor => !formData.liked_flavor_profile.includes(flavor))
                  .map(flavor => ({
                    value: flavor,
                    label: getDisplayName(flavor)
                  }))}
                value={newFlavorProfile}
                onValueChange={setNewFlavorProfile}
                placeholder="Select flavor preference"
                searchPlaceholder="Search flavors..."
                emptyMessage="No flavors found."
                className="flex-1"
              />
              <Button onClick={addFlavorProfile} disabled={!newFlavorProfile.trim()}>
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Priorities */}
      <Card>
        <CardHeader>
          <CardTitle>Priorities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.priorities.map((priority, index) => (
              <div key={priority} className="flex items-center gap-1">
                <Badge variant="secondary">{priority}</Badge>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removePriority(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            {formData.priorities.length === 0 && (
              <p className="text-gray-500 text-sm">No priorities set</p>
            )}
          </div>
          
          {isEditing && (
            <div className="flex gap-2">
              <Combobox
                options={getPriorities()
                  .filter(priority => !formData.priorities.includes(priority))
                  .map(priority => ({
                    value: priority,
                    label: getDisplayName(priority)
                  }))}
                value={newPriority}
                onValueChange={setNewPriority}
                placeholder="Select priority"
                searchPlaceholder="Search priorities..."
                emptyMessage="No priorities found."
                className="flex-1"
              />
              <Button onClick={addPriority} disabled={!newPriority.trim()}>
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your address"
                />
              ) : (
                <p className="text-lg">{formData.address || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter your city"
                />
              ) : (
                <p className="text-lg">{formData.city || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              {isEditing ? (
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Enter your state"
                />
              ) : (
                <p className="text-lg">{formData.state || 'Not provided'}</p>
              )}
            </div>
            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              {isEditing ? (
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                  placeholder="Enter your ZIP code"
                />
              ) : (
                <p className="text-lg">{formData.zip || 'Not provided'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Role */}
      <Card>
        <CardHeader>
          <CardTitle>User Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={formData.role === 'deliverer' ? 'default' : 'secondary'}>
              {formData.role === 'deliverer' ? 'Deliverer' : 'Shopper'}
            </Badge>
            <p className="text-sm text-gray-600">
              {formData.role === 'deliverer' 
                ? 'You deliver groceries to other users' 
                : 'You shop for groceries and recipes'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
